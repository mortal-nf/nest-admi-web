import type { TableColumn } from '@/components/core/dynamic-table/src/types/column';

import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { Icon } from '@iconify/vue';

// 项目状态映射
const statusMap: Record<string, { color: string; text: string }> = {
  planning: { color: 'blue', text: '规划中' },
  in_progress: { color: 'green', text: '进行中' },
  overdue: { color: 'orange', text: '已逾期' },
  completed: { color: 'green', text: '已完成' },
  archived: { color: 'gray', text: '已归档' },
  cancelled: { color: 'red', text: '已取消' },
  paused: { color: 'yellow', text: '已暂停' },
};

// 项目数据结构
export interface TableListItem {
  id: number;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  requirementPoolId?: number;
  serviceObjectId?: number;
  createdAt?: string;
  updatedAt?: string;
  creatorId?: number;
  updaterId?: number;
}
export type TableColumnItem = TableColumn<TableListItem>;




// 表格列配置
export const getColumns = (): TableColumnItem[] => [
  {
    title: '项目名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '项目状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const status = statusMap[text as string];
      return status ? h(Tag, { color: status.color }, status.text) : '';
    },
  },
  {
    title: '开始日期',
    dataIndex: 'startDate',
    width: 160,
    ellipsis: true,
  },
  {
    title: '结束日期',
    dataIndex: 'endDate',
    width: 160,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 160,
    ellipsis: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 160,
    ellipsis: true,
  },
];

// 表格基础列（不包含操作列）
export const baseColumns = getColumns();

// 表格列配置已在 index.vue 中定义并传递操作回调
