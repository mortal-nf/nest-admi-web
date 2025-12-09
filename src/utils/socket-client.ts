// src/utils/socket-client.ts
import { io, Socket } from 'socket.io-client';

// 事件类型定义
export type SocketEventType =
    | 'connection-change'
    | 'data'
    | 'error'
    | 'connect'
    | 'disconnect';

// 监听器回调函数类型
export type EventCallback<T = any> = (data: T) => void;

// 连接选项接口
export interface SocketClientOptions {
    url?: string;
    namespace?: string;
    path?: string;
    transports?: ('websocket' | 'polling')[];
    reconnection?: boolean;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
    reconnectionAttempts?: number;
    timeout?: number;
    autoConnect?: boolean;
}

// 监控数据接口（与后端对应）
export interface SystemMetrics {
    timestamp: number;
    cpu: { load: number; cores: number; speed?: number };
    memory: { total: number; used: number; usage: number };
    disk: Array<{ total: number; used: number; usage: number; mount: string }>;
    network: { rxSec: number; txSec: number };
    uptime?: number;
}

// 连接状态变更事件数据
export interface ConnectionStatus {
    connected: boolean;
    timestamp: number;
    reason?: string;
}

// 错误事件数据
export interface SocketError {
    message: string;
    code?: string | number;
    timestamp: number;
}

export class MetricsSocketClient {
    private socket: Socket | null = null;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private listeners: Map<SocketEventType, EventCallback[]> = new Map();
    private options: SocketClientOptions;
    private connectionStatusListeners: Array<(status: ConnectionStatus) => void> = [];
    private lastMetricsData: SystemMetrics | null = null;
    private connectionTimer: NodeJS.Timeout | null = null;

    constructor(options: SocketClientOptions = {}) {
        // 默认配置
        this.options = {
            url: 'http://localhost:3000',
            namespace: 'metrics',
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            timeout: 10000,
            autoConnect: true,
            ...options,
        };
    }

    /**
     * 连接到 WebSocket 服务器
     */
    public connect(): void {
        if (this.socket?.connected) {
            console.warn('WebSocket 已连接，跳过重复连接');
            return;
        }

        // 构建完整的连接URL
        const fullUrl = `${this.options.url}/${this.options.namespace}`;

        console.log(`正在连接到监控服务器: ${fullUrl}`);

        this.socket = io(fullUrl, {
            path: this.options.path,
            transports: this.options.transports,
            reconnection: this.options.reconnection,
            reconnectionDelay: this.options.reconnectionDelay,
            reconnectionDelayMax: this.options.reconnectionDelayMax,
            reconnectionAttempts: this.options.reconnectionAttempts,
            timeout: this.options.timeout,
            autoConnect: this.options.autoConnect,
        });

        this.setupEventListeners();
    }

    /**
     * 设置事件监听器
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        // 连接成功
        this.socket.on('connect', () => {
            console.log('✅ 已连接到监控服务器');
            this.isConnected = true;
            this.reconnectAttempts = 0;

            const status: ConnectionStatus = {
                connected: true,
                timestamp: Date.now(),
            };

            this.emit('connection-change', status);
            this.notifyConnectionStatusListeners(status);

            // 连接成功后，如果有缓存数据，立即发送一次
            if (this.lastMetricsData) {
                this.emit('data', this.lastMetricsData);
            }
        });

        // 接收监控数据（关键事件）
        this.socket.on('metrics', (data: SystemMetrics) => {
            console.debug('收到监控数据:', data.timestamp);
            this.lastMetricsData = data;
            this.emit('data', data);
        });

        // 连接断开
        this.socket.on('disconnect', (reason: string) => {
            console.warn('❌ 连接断开:', reason);
            this.isConnected = false;

            const status: ConnectionStatus = {
                connected: false,
                timestamp: Date.now(),
                reason,
            };

            this.emit('connection-change', status);
            this.notifyConnectionStatusListeners(status);
            this.handleReconnect();
        });

        // 连接错误
        this.socket.on('connect_error', (error: Error) => {
            console.error('连接错误:', error.message);

            const errorData: SocketError = {
                message: error.message,
                timestamp: Date.now(),
            };

            this.emit('error', errorData);
        });

        // 重连尝试
        this.socket.on('reconnect_attempt', (attempt: number) => {
            console.log(`尝试重连 (${attempt}/${this.maxReconnectAttempts})...`);
            this.reconnectAttempts = attempt;
        });

        // 重连成功
        this.socket.on('reconnect', (attempt: number) => {
            console.log(`✅ 重连成功 (尝试次数: ${attempt})`);
            this.reconnectAttempts = 0;
        });

        // 重连失败
        this.socket.on('reconnect_failed', () => {
            console.error('重连失败，已达到最大尝试次数');
            this.reconnectAttempts = this.maxReconnectAttempts;
        });

        // 自定义事件：请求特定时间段的数据
        this.socket.on('metrics-history', (data: SystemMetrics[]) => {
            console.log('收到历史数据:', data.length, '条记录');
            // 可以在这里处理历史数据，例如更新图表
        });
    }

    /**
     * 订阅事件
     */
    public on<T = any>(event: SocketEventType, callback: EventCallback<T>): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    /**
     * 取消订阅事件
     */
    public off<T = any>(event: SocketEventType, callback?: EventCallback<T>): void {
        const callbacks = this.listeners.get(event);
        if (!callbacks) return;

        if (callback) {
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        } else {
            // 如果不指定回调函数，则清除该事件的所有监听器
            this.listeners.set(event, []);
        }
    }

    /**
     * 触发事件给所有监听者
     */
    private emit<T = any>(event: SocketEventType, data: T): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            // 使用 setTimeout 避免阻塞主线程
            setTimeout(() => {
                callbacks.forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`事件 ${event} 的回调执行错误:`, error);
                    }
                });
            }, 0);
        }
    }

    /**
     * 主动发送消息到服务器
     */
    public send<T = any>(event: string, data?: T): void {
        if (!this.socket || !this.isConnected) {
            console.warn('无法发送消息，WebSocket 未连接');
            return;
        }

        this.socket.emit(event, data);
    }

    /**
     * 请求特定时间段的指标数据
     */
    public requestHistory(duration: string = '5m', interval: string = '10s'): void {
        this.send('request-history', { duration, interval });
    }

    /**
     * 手动请求当前指标数据
     */
    public requestCurrentMetrics(): void {
        this.send('request-metrics');
    }

    /**
     * 处理重连逻辑
     */
    private handleReconnect(): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;

            const delay = Math.min(
                2000 * this.reconnectAttempts,
                this.options.reconnectionDelayMax || 5000
            );

            console.log(`将在 ${delay}ms 后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

            setTimeout(() => {
                if (this.socket && !this.socket.connected) {
                    this.socket.connect();
                }
            }, delay);
        } else {
            console.error('已达到最大重连尝试次数，停止重连');
            this.notifyConnectionStatusListeners({
                connected: false,
                timestamp: Date.now(),
                reason: 'max_reconnect_attempts_reached',
            });
        }
    }

    /**
     * 断开连接
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.listeners.clear();
            this.connectionStatusListeners = [];

            if (this.connectionTimer) {
                clearTimeout(this.connectionTimer);
                this.connectionTimer = null;
            }

            console.log('WebSocket 连接已断开');
        }
    }

    /**
     * 获取当前连接状态
     */
    public getConnectionStatus(): boolean {
        return this.isConnected;
    }

    /**
     * 获取最近一次收到的监控数据
     */
    public getLastMetrics(): SystemMetrics | null {
        return this.lastMetricsData;
    }

    /**
     * 获取重连尝试次数
     */
    public getReconnectAttempts(): number {
        return this.reconnectAttempts;
    }

    /**
     * 添加连接状态监听器（专用方法，便于组件使用）
     */
    public addConnectionStatusListener(listener: (status: ConnectionStatus) => void): void {
        this.connectionStatusListeners.push(listener);
    }

    /**
     * 移除连接状态监听器
     */
    public removeConnectionStatusListener(listener: (status: ConnectionStatus) => void): void {
        const index = this.connectionStatusListeners.indexOf(listener);
        if (index > -1) {
            this.connectionStatusListeners.splice(index, 1);
        }
    }

    /**
     * 通知所有连接状态监听器
     */
    private notifyConnectionStatusListeners(status: ConnectionStatus): void {
        this.connectionStatusListeners.forEach(listener => {
            try {
                listener(status);
            } catch (error) {
                console.error('连接状态监听器执行错误:', error);
            }
        });
    }

    /**
     * 设置连接超时检查
     */
    public startConnectionWatchdog(timeout: number = 30000): void {
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
        }

        this.connectionTimer = setTimeout(() => {
            if (this.isConnected && this.lastMetricsData) {
                const timeSinceLastUpdate = Date.now() - this.lastMetricsData.timestamp;

                if (timeSinceLastUpdate > timeout) {
                    console.warn(`检测到数据更新超时 (${timeSinceLastUpdate}ms)，可能连接已失效`);

                    const status: ConnectionStatus = {
                        connected: false,
                        timestamp: Date.now(),
                        reason: 'data_timeout',
                    };

                    this.notifyConnectionStatusListeners(status);

                    // 尝试重新连接
                    if (this.socket) {
                        this.socket.disconnect();
                        this.socket.connect();
                    }
                }
            }
        }, timeout);
    }

    /**
     * 停止连接监视器
     */
    public stopConnectionWatchdog(): void {
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
        }
    }

    /**
     * 销毁实例，清理所有资源
     */
    public destroy(): void {
        this.disconnect();
        this.listeners.clear();
        this.connectionStatusListeners = [];
        this.lastMetricsData = null;
    }
}

// 创建单例实例，确保全局只有一个连接
export const metricsSocket = new MetricsSocketClient({
    url: 'http://localhost:3000',
    namespace: 'metrics',
    reconnectionAttempts: 10,
});

// 默认导出
export default metricsSocket;
