import dayjs from 'dayjs';
import type { TableColumn } from '@/components/core/dynamic-table/src/types/column';

// 表格列表项类型
export interface TableListItem {
  id: number;
  title: string;
  description?: string;
  status: string;
  order: number;
  dueDate?: string;
  actualCompletionDate?: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
  project?: {
    id: number;
    name: string;
  };
}

// 表格列类型
export type TableColumnItem = TableColumn<TableListItem>;

// 基础表格列配置
export const baseColumns: TableColumnItem[] = [
  {
    title: '任务标题',
    dataIndex: 'title',
    width: 200,
    ellipsis: true,
  },
  {
    title: '任务描述',
    dataIndex: 'description',
    width: 300,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      const statusMap: Record<string, { color: string; text: string }> = {
        pending: { color: 'orange', text: '待处理' },
        in_progress: { color: 'blue', text: '处理中' },
        completed: { color: 'green', text: '已完成' },
        cancelled: { color: 'gray', text: '已取消' },
        blocked: { color: 'red', text: '已阻塞' },
      };
      const status = statusMap[text] || { color: 'default', text };
      return <a-tag color={status.color}>{status.text}</a-tag>;
    },
  },
  {
    title: '顺序',
    dataIndex: 'order',
    width: 100,
    sorter: true,
    customRender: ({ text }) => {
      return <span>{text || 0}</span>;
    },
  },
  {
    title: '截止日期',
    dataIndex: 'dueDate',
    width: 180,
    sorter: true,
    customRender: ({ text }) => {
      return text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-';
    },
  },
  {
    title: '实际完成日期',
    dataIndex: 'actualCompletionDate',
    width: 180,
    sorter: true,
    customRender: ({ text }) => {
      return text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-';
    },
  },
  {
    title: '所属项目',
    dataIndex: ['project', 'name'],
    width: 150,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    sorter: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 180,
    sorter: true,
  },
];
