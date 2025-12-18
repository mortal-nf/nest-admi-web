import type { FormSchema } from '@/components/core/schema-form/';

export const projectSchemas = (): FormSchema<Record<string, any>>[] => [
  {
    field: 'name',
    component: 'Input',
    label: '项目名称',
    rules: [{ required: true, type: 'string', message: '请输入项目名称' }],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'status',
    component: 'Select',
    label: '项目状态',
    defaultValue: 'planning',
    rules: [{ required: true, type: 'string', message: '请选择项目状态' }],
    componentProps: {
      options: [
        { label: '规划中', value: 'planning' },
        { label: '进行中', value: 'in_progress' },
        { label: '已逾期', value: 'overdue' },
        { label: '已完成', value: 'completed' },
        { label: '已归档', value: 'archived' },
        { label: '已取消', value: 'cancelled' },
        { label: '已暂停', value: 'paused' },
      ],
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'startDate',
    component: 'DatePicker',
    label: '开始日期',
    rules: [{ message: '请选择开始日期' }],
    componentProps: {
      style: { width: '100%' },
      placeholder: '请选择开始日期',
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'endDate',
    component: 'DatePicker',
    label: '结束日期',
    rules: [{ message: '请选择结束日期' }],
    componentProps: {
      style: { width: '100%' },
      placeholder: '请选择结束日期',
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'description',
    component: 'InputTextArea',
    label: '项目描述',
    componentProps: {
      placeholder: '请输入项目描述',
      rows: 4,
    },
  },
];
