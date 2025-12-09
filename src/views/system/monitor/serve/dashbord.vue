<!-- src/views/dashboard/hardware-dashboard.vue -->
<template>
    <div class="hardware-dashboard">
        <PageHeader title="硬件监控面板" subtitle="实时系统资源使用情况">
            <template #extra>
                <Button @click="handleManualRefresh" :loading="manualLoading">
                    <template #icon>
                        <ReloadOutlined />
                    </template>
                    刷新数据
                </Button>
            </template>
        </PageHeader>

        <div class="dashboard-content">
            <!-- 系统概览卡片 -->
            <Row :gutter="[20, 20]" class="overview-cards">
                <Col :span="24" :md="8">
                    <Card class="overview-card cpu-card">
                        <div class="card-icon">
                            <DesktopOutlined />
                        </div>
                        <div class="card-content">
                            <div class="card-title">CPU使用率</div>
                            <div class="card-value">{{ cpuLoadPercentage }}%</div>
                            <Progress
                                :percent="cpuLoadPercentage"
                                :strokeColor="getProgressColor(cpuLoadPercentage)"
                                :showInfo="false"
                            />
                        </div>
                    </Card>
                </Col>

                <Col :span="24" :md="8">
                    <Card class="overview-card memory-card">
                        <div class="card-icon">
                            <DatabaseOutlined />
                        </div>
                        <div class="card-content">
                            <div class="card-title">内存使用率</div>
                            <div class="card-value">{{ memoryPercentage }}%</div>
                            <Progress
                                :percent="memoryPercentage"
                                :strokeColor="getProgressColor(memoryPercentage)"
                                :showInfo="false"
                            />
                        </div>
                    </Card>
                </Col>

                <Col :span="24" :md="8">
                    <Card class="overview-card disk-card">
                        <div class="card-icon">
                            <HddOutlined />
                        </div>
                        <div class="card-content">
                            <div class="card-title">磁盘使用率</div>
                            <div class="card-value">{{ diskPercentage }}%</div>
                            <Progress
                                :percent="diskPercentage"
                                :strokeColor="getProgressColor(diskPercentage)"
                                :showInfo="false"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            <!-- 详细监控图表 -->
            <div class="monitor-sections">
                <!-- CPU监控 -->
                <Card class="monitor-card" title="CPU监控">
                    <template #extra>
                        <Tag :color="getTagColor(cpuLoadPercentage)">当前: {{ cpuLoadPercentage }}%</Tag>
                    </template>
                    <div class="chart-container">
                        <VChart
                            ref="cpuChartRef"
                            :option="cpuLoadOption"
                            style="height: 300px"
                            autoresize
                        />
                    </div>
                    <Descriptions :column="{ xs: 1, sm: 2 }" class="hardware-info">
                        <Descriptions.Item label="CPU型号">{{ parseCpuInfo }}</Descriptions.Item>
                        <Descriptions.Item label="核心数">{{ cpu.physicalCores }} 核心</Descriptions.Item>
                        <Descriptions.Item label="基准频率">{{ cpu.speed }} GHz</Descriptions.Item>
                    </Descriptions>
                </Card>

                <!-- 内存监控 -->
                <Card class="monitor-card" title="内存监控">
                    <template #extra>
                        <Tag :color="getTagColor(memoryPercentage)">当前: {{ memoryPercentage }}%</Tag>
                    </template>
                    <div class="chart-container">
                        <VChart
                            ref="memoryChartRef"
                            :option="memoryUsageOption"
                            style="height: 300px"
                            autoresize
                        />
                    </div>
                    <Descriptions :column="{ xs: 1, sm: 2 }" class="hardware-info">
                        <Descriptions.Item label="总内存">{{ formatMemoryUnit.total }}</Descriptions.Item>
                        <Descriptions.Item label="已用内存">{{ formatMemoryUnit.used }}</Descriptions.Item>
                        <Descriptions.Item label="可用内存">{{ formatMemoryUnit.free }}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <!-- 磁盘监控 -->
                <Card class="monitor-card" title="磁盘监控">
                    <template #extra>
                        <Tag :color="getTagColor(diskPercentage)">当前: {{ diskPercentage }}%</Tag>
                    </template>
                    <div class="chart-container">
                        <VChart
                            ref="diskChartRef"
                            :option="diskUsageOption"
                            style="height: 300px"
                            autoresize
                        />
                    </div>
                    <Descriptions :column="{ xs: 1, sm: 2 }" class="hardware-info">
                        <Descriptions.Item label="总空间">{{ formatDiskUnit.size }}</Descriptions.Item>
                        <Descriptions.Item label="已用空间">{{ formatDiskUnit.used }}</Descriptions.Item>
                        <Descriptions.Item label="可用空间">{{ formatDiskUnit.available }}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
import {
    Card,
    Row,
    Col,
    Descriptions,
    Progress,
    Button,
    Tag,
    PageHeader
} from 'ant-design-vue';
import {
    DesktopOutlined,
    DatabaseOutlined,
    HddOutlined,
    ReloadOutlined
} from '@ant-design/icons-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import {
    GridComponent,
    LegendComponent,
    TooltipComponent,
    TitleComponent
} from 'echarts/components';
import VChart from 'vue-echarts';
import { formatSizeUnits } from '@/utils';
import Api from '@/api/';

// 注册 echarts 组件
use([
    CanvasRenderer,
    LineChart,
    PieChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent
]);

defineOptions({
    name: 'HardwareDashboard'
});

let intervalId: number;
const maxDataPoints = 30;
const manualLoading = ref(false);

// 图表引用
const cpuChartRef = ref<InstanceType<typeof VChart> | null>(null);
const memoryChartRef = ref<InstanceType<typeof VChart> | null>(null);
const diskChartRef = ref<InstanceType<typeof VChart> | null>(null);

// 存储历史数据用于图表
const cpuHistory = ref<number[]>([]);
const memoryHistory = ref<number[]>([]);
const diskHistory = ref<number[]>([]);
const timeLabels = ref<string[]>([]);

const hardwareInfo = reactive({
    disk: {
        size: 0,
        used: 0,
        available: 0,
    },
    memory: {
        total: 0,
        available: 0,
    },
    cpu: {
        manufacturer: '',
        brand: '',
        physicalCores: 0,
        model: '',
        speed: 0,
        rawCurrentLoad: 0,
        rawCurrentLoadIdle: 0,
    },
});

const { disk, memory, cpu } = toRefs(hardwareInfo);

// 计算属性
const formatDiskUnit = computed(() => {
    return {
        size: formatSizeUnits(disk.value.size),
        used: formatSizeUnits(disk.value.used),
        available: formatSizeUnits(disk.value.available),
    };
});

const formatMemoryUnit = computed(() => {
    return {
        total: formatSizeUnits(memory.value.total),
        free: formatSizeUnits(memory.value.available),
        used: formatSizeUnits(memory.value.total - memory.value.available),
    };
});

const diskPercentage = computed(() => {
    if (disk.value.size <= 0) {
        return 0;
    }
    return Math.floor((disk.value.used / disk.value.size) * 100);
});

const memoryPercentage = computed(() => {
    if (memory.value.total <= 0) {
        return 0;
    }
    return Math.floor(((memory.value.total - memory.value.available) / memory.value.total) * 100);
});

const parseCpuInfo = computed(() => {
    return `${cpu.value.brand} @ ${cpu.value.speed}GHz`;
});

const cpuLoadPercentage = computed(() => {
    const total = cpu.value.rawCurrentLoad + cpu.value.rawCurrentLoadIdle;
    if (total <= 0) {
        return 0;
    }
    return Math.floor((cpu.value.rawCurrentLoad / total) * 100);
});

// 图表配置选项
const cpuLoadOption = computed(() => {
    return {
        title: {
            text: 'CPU使用率趋势',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textStyle: {
                color: '#fff'
            },
            formatter: (params: any[]) => {
                return `${params[0].name}<br/>${params[0].marker} 使用率: ${params[0].value}%`;
            }
        },
        xAxis: {
            type: 'category',
            data: [...timeLabels.value], // 使用展开运算符避免引用问题
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '使用率(%)',
            max: 100,
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        series: [{
            data: [...cpuHistory.value], // 使用展开运算符避免引用问题
            type: 'line',
            smooth: true,
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                        { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
                    ]
                }
            },
            itemStyle: {
                color: '#1890ff'
            },
            lineStyle: {
                width: 2
            }
        }]
    };
});

const memoryUsageOption = computed(() => {
    return {
        title: {
            text: '内存使用情况',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textStyle: {
                color: '#fff'
            },
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 'bottom',
            itemGap: 15
        },
        series: [{
            name: '内存',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '14',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {
                    value: memory.value.total - memory.value.available,
                    name: '已用内存',
                    itemStyle: { color: '#ff4d4f' }
                },
                {
                    value: memory.value.available,
                    name: '可用内存',
                    itemStyle: { color: '#52c41a' }
                }
            ]
        }]
    };
});

const diskUsageOption = computed(() => {
    return {
        title: {
            text: '磁盘使用情况',
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            textStyle: {
                color: '#fff'
            }
        },
        xAxis: {
            type: 'category',
            data: ['磁盘'],
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        series: [{
            name: '使用情况',
            type: 'bar',
            barWidth: '50%',
            data: [{
                value: diskPercentage.value,
                itemStyle: {
                    color: diskPercentage.value > 80 ? '#ff4d4f' :
                        diskPercentage.value > 60 ? '#faad14' : '#52c41a',
                    borderRadius: [4, 4, 0, 0]
                }
            }],
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%',
                fontWeight: 'bold'
            }
        }]
    };
});

// 更新历史数据
const updateHistoryData = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    // 添加新数据点
    cpuHistory.value.push(cpuLoadPercentage.value);
    memoryHistory.value.push(memoryPercentage.value);
    diskHistory.value.push(diskPercentage.value);
    timeLabels.value.push(timeStr);

    // 保持最大数据点数
    if (cpuHistory.value.length > maxDataPoints) {
        cpuHistory.value.shift();
        memoryHistory.value.shift();
        diskHistory.value.shift();
        timeLabels.value.shift();
    }
};

// 获取进度条颜色
const getProgressColor = (percentage: number) => {
    if (percentage < 30) return '#52c41a';
    if (percentage < 70) return '#faad14';
    return '#ff4d4f';
};

// 获取标签颜色
const getTagColor = (percentage: number) => {
    if (percentage < 30) return 'success';
    if (percentage < 70) return 'warning';
    return 'error';
};

// 刷新数据
const refresh = async () => {
    try {
        const data = await Api.systemServe.serveStat();
        disk.value = data.disk;
        memory.value = data.memory;
        cpu.value = data.cpu;
        updateHistoryData();
    } catch (error) {
        console.error('获取硬件信息失败:', error);
    }
};

// 手动刷新
const handleManualRefresh = async () => {
    manualLoading.value = true;
    try {
        await refresh();
    } finally {
        manualLoading.value = false;
    }
};

// 初始化并定时刷新
onMounted(() => {
    refresh().then(() => {
        intervalId = window.setInterval(refresh, 10000);
    });
});

onBeforeUnmount(() => {
    clearInterval(intervalId);
});
</script>

<style lang="less" scoped>
.hardware-dashboard {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 64px);

    .dashboard-content {
        margin-top: 20px;
    }

    // 概览卡片
    .overview-cards {
        margin-bottom: 20px;

        .overview-card {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;

            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            }

            .card-icon {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 32px;
                opacity: 0.1;
            }

            .card-content {
                position: relative;
                padding: 20px;

                .card-title {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 10px;
                }

                .card-value {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
            }
        }

        .cpu-card {
            border-left: 4px solid #1890ff;

            .card-icon {
                color: #1890ff;
            }
        }

        .memory-card {
            border-left: 4px solid #52c41a;

            .card-icon {
                color: #52c41a;
            }
        }

        .disk-card {
            border-left: 4px solid #faad14;

            .card-icon {
                color: #faad14;
            }
        }
    }

    // 监控卡片
    .monitor-sections {
        .monitor-card {
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            :deep(.ant-card-head) {
                background-color: #fafafa;
                border-bottom: 1px solid #f0f0f0;
            }

            .chart-container {
                height: 300px;
            }

            .hardware-info {
                margin-top: 20px;
                padding: 15px;
                background-color: #fafafa;
                border-radius: 4px;
            }
        }
    }

    // 响应式调整
    @media (max-width: 768px) {
        padding: 10px;

        .overview-cards {
            .overview-card {
                .card-content {
                    padding: 15px;

                    .card-title {
                        font-size: 14px;
                    }

                    .card-value {
                        font-size: 20px;
                    }
                }
            }
        }

        .monitor-sections {
            .monitor-card {
                .chart-container {
                    height: 250px;
                }
            }
        }
    }
}
</style>
