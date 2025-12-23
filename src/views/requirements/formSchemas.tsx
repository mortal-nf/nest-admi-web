import { computed } from 'vue';
import type { FormSchema } from '@/components/core/dynamic-form';
import Api from '@/api/';

/**
 * 需求管理表单配置
 */
export const requirementSchemas = (): FormSchema[] => {
  return [
    {
      field: 'title',
      component: 'Input',
      label: '需求标题',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请输入需求标题',
        allowClear: true,
        showCount: true,
        maxLength: 255,
      },
      rules: [
        { required: true, message: '请输入需求标题', trigger: 'blur' },
        { max: 255, message: '需求标题不能超过255个字符', trigger: 'blur' },
      ],
    },
    {
      field: 'description',
      component: 'Input.TextArea',
      label: '需求描述',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请输入需求描述',
        allowClear: true,
        showCount: true,
        maxLength: 500,
        rows: 4,
      },
      rules: [
        { max: 500, message: '需求描述不能超过500个字符', trigger: 'blur' },
      ],
    },
    {
      field: 'status',
      component: 'Select',
      label: '状态',
      defaultValue: 'pending',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择需求状态',
        allowClear: true,
      },
      options: [
        { label: '待处理', value: 'pending' },
        { label: '处理中', value: 'processing' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' },
        { label: '已阻塞', value: 'blocked' },
      ],
      rules: [
        { required: true, message: '请选择需求状态', trigger: 'change' },
      ],
    },
    {
      field: 'priority',
      component: 'Select',
      label: '优先级',
      defaultValue: 'medium',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择优先级',
        allowClear: true,
      },
      options: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
        { label: '紧急', value: 'urgent' },
      ],
      rules: [
        { required: true, message: '请选择优先级', trigger: 'change' },
      ],
    },
    {
      field: 'progress',
      component: 'InputNumber',
      label: '进度',
      defaultValue: 0,
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请输入进度',
        min: 0,
        max: 100,
        formatter: (value) => `${value}%`,
        parser: (value) => value.replace('%', ''),
      },
      rules: [
        { required: true, message: '请输入进度', trigger: 'blur' },
        { type: 'number', message: '进度必须是数字', trigger: 'blur' },
        { min: 0, message: '进度不能小于0', trigger: 'blur' },
        { max: 100, message: '进度不能大于100', trigger: 'blur' },
      ],
    },
    {
      field: 'requirementPoolId',
      component: 'Select',
      label: '需求池',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择需求池',
        allowClear: true,
      },
      options: async () => {
        try {
          const data = await Api.requirementPools.getRequirementPoolList({ pageSize: 1000 });
          return data.items.map(item => ({ label: item.name, value: item.id }));
        } catch (error) {
          console.error('获取需求池列表失败:', error);
          return [];
        }
      },
      rules: [
        { required: true, message: '请选择需求池', trigger: 'change' },
      ],
    },
    {
      field: 'projectId',
      component: 'Select',
      label: '所属项目',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择所属项目（可选）',
        allowClear: true,
      },
      options: async () => {
        try {
          const data = await Api.projects.getProjectList({ pageSize: 1000 });
          return data.items.map(item => ({ label: item.name, value: item.id }));
        } catch (error) {
          console.error('获取项目列表失败:', error);
          return [];
        }
      },
    },
  ];
};
