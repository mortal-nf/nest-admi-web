import type { TableColumn } from '@/components/core/dynamic-table/src/types/column';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

// 服务对象数据结构
export interface TableListItem {
  id: number;
  name: string;
  description?: string;
  enabled: string;
  createdAt?: string;
  updatedAt?: string;
  creatorId?: number;
  updaterId?: number;
}

export type TableColumnItem = TableColumn<TableListItem>;

// 表格列配置
export const getColumns = (): TableColumnItem[] => [
  {
    title: '服务对象名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '服务对象描述',
    dataIndex: 'description',
    width: 300,
    ellipsis: true,
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 100,
    customRender: ({ text }) => {
      return h(Tag, { color: text === '1' ? 'green' : 'red' }, text === '1' ? '启用' : '禁用');
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
