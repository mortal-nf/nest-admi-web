// src/utils/socket-helpers.ts

/**
 * 格式化网络速度
 */
export function formatNetworkSpeed(bytesPerSec: number): { value: string; unit: string } {
    if (bytesPerSec >= 1024 * 1024) {
        return {
            value: (bytesPerSec / (1024 * 1024)).toFixed(2),
            unit: 'MB/s'
        };
    } else if (bytesPerSec >= 1024) {
        return {
            value: (bytesPerSec / 1024).toFixed(2),
            unit: 'KB/s'
        };
    }
    return {
        value: bytesPerSec.toFixed(2),
        unit: 'B/s'
    };
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化运行时间
 */
export function formatUptime(seconds?: number): string {
    if (!seconds) return '0s';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
}

/**
 * 获取磁盘使用率状态类
 */
export function getDiskUsageClass(usage: number): 'low' | 'medium' | 'high' {
    if (usage < 70) return 'low';
    if (usage < 90) return 'medium';
    return 'high';
}

/**
 * 创建 WebSocket 连接状态钩子（Vue 3 Composition API）
 */
import {onMounted, onUnmounted, ref} from 'vue';
// @ts-ignore
import {ConnectionStatus, metricsSocket} from './socket-client';

export function useSocketConnection() {
    const isConnected = ref(false);
    const lastUpdate = ref<Date | null>(null);

    const handleConnectionChange = (status: ConnectionStatus) => {
        isConnected.value = status.connected;
        lastUpdate.value = new Date(status.timestamp);
    };

    onMounted(() => {
        metricsSocket.addConnectionStatusListener(handleConnectionChange);
        // 初始状态
        isConnected.value = metricsSocket.getConnectionStatus();
    });

    onUnmounted(() => {
        metricsSocket.removeConnectionStatusListener(handleConnectionChange);
    });

    return {
        isConnected,
        lastUpdate,
    };
}
