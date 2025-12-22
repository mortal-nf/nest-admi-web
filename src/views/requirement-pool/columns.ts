import type { TableColumn } from '@/components/core/dynamic-table/src/types/column';

// 需求池数据结构
export interface TableListItem {
  id: number;
  name: string;
  description?: string;
  serviceObjectId: number;
  serviceObject?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  creatorId?: number;
  updaterId?: number;
}

export type TableColumnItem = TableColumn<TableListItem>;

// 表格列配置
export const getColumns = (): TableColumnItem[] => [
  {
    title: '需求池名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '需求池描述',
    dataIndex: 'description',
    width: 300,
    ellipsis: true,
  },
  {
    title: '关联服务对象',
    dataIndex: ['serviceObject', 'name'],
    width: 200,
    ellipsis: true,
    customRender: ({ record }) => {
      return record.serviceObject?.name || '未关联';
    },
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
