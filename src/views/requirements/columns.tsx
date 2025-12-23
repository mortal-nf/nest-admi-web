import type { TableColumn } from '@/components/core/dynamic-table/src/types/column';

// 表格列表项类型
export interface TableListItem {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  progress: number;
  requirementPoolId: number;
  projectId?: number;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
  requirementPool?: {
    id: number;
    name: string;
  };
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
    title: '需求标题',
    dataIndex: 'title',
    width: 200,
    ellipsis: true,
  },
  {
    title: '需求描述',
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
        processing: { color: 'blue', text: '处理中' },
        completed: { color: 'green', text: '已完成' },
        cancelled: { color: 'gray', text: '已取消' },
        blocked: { color: 'red', text: '已阻塞' },
      };
      const status = statusMap[text] || { color: 'default', text };
      return <a-tag color={status.color}>{status.text}</a-tag>;
    },
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    width: 120,
    customRender: ({ text }) => {
      const priorityMap: Record<string, { color: string; text: string }> = {
        low: { color: 'default', text: '低' },
        medium: { color: 'blue', text: '中' },
        high: { color: 'orange', text: '高' },
        urgent: { color: 'red', text: '紧急' },
      };
      const priority = priorityMap[text] || { color: 'default', text };
      return <a-tag color={priority.color}>{priority.text}</a-tag>;
    },
  },
  {
    title: '进度',
    dataIndex: 'progress',
    width: 150,
    customRender: ({ text }) => {
      return (
        <div>
          <a-progress percent={text} size="small" />
          <span style={{ marginLeft: 8 }}>{text}%</span>
        </div>
      );
    },
  },
  {
    title: '需求池',
    dataIndex: ['requirementPool', 'name'],
    width: 150,
    ellipsis: true,
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
