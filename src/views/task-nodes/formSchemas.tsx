
import Api from '@/api/';

// 动态表单组件尚未提供类型声明，先使用 any 绕过编译错误
// TODO: 待 @/components/core/dynamic-form 导出类型后，替换为真实类型
type FormSchema = any;

/**
 * 任务节点管理表单配置
 */
export const taskNodeSchemas = (): FormSchema[] => {
  return [
    {
      field: 'title',
      component: 'Input',
      label: '任务标题',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请输入任务标题',
        allowClear: true,
        showCount: true,
        maxLength: 255,
      },
      rules: [
        { required: true, message: '请输入任务标题', trigger: 'blur' },
        { max: 255, message: '任务标题不能超过255个字符', trigger: 'blur' },
      ],
    },
    {
      field: 'description',
      component: 'Input.TextArea',
      label: '任务描述',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请输入任务描述',
        allowClear: true,
        showCount: true,
        maxLength: 500,
        rows: 4,
      },
      rules: [
        { max: 500, message: '任务描述不能超过500个字符', trigger: 'blur' },
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
        placeholder: '请选择任务状态',
        allowClear: true,
      },
      options: [
        { label: '待处理', value: 'pending' },
        { label: '处理中', value: 'in_progress' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' },
        { label: '已阻塞', value: 'blocked' },
      ],
      rules: [
        { required: true, message: '请选择任务状态', trigger: 'change' },
      ],
    },
    {
      field: 'order',
      component: 'InputNumber',
      label: '顺序',
      defaultValue: 0,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请输入任务顺序',
        min: 0,
        max: 9999,
      },
      rules: [
        { type: 'number', message: '顺序必须是数字', trigger: 'blur' },
        { min: 0, message: '顺序不能小于0', trigger: 'blur' },
        { max: 9999, message: '顺序不能大于9999', trigger: 'blur' },
      ],
    },
    {
      field: 'dueDate',
      component: 'DatePicker',
      label: '截止日期',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择截止日期',
        showTime: true,
        allowClear: true,
      },
      rules: [
        { type: 'object', message: '请选择截止日期', trigger: 'change' },
      ],
    },
    {
      field: 'actualCompletionDate',
      component: 'DatePicker',
      label: '实际完成日期',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择实际完成日期',
        showTime: true,
        allowClear: true,
      },
      rules: [
        { type: 'object', message: '请选择实际完成日期', trigger: 'change' },
      ],
    },
    {
      field: 'projectId',
      component: 'ApiSelect',
      label: '所属项目',
      required: true,
      colProps: { span: 24 },
      componentProps: {
        placeholder: '请选择所属项目',
        api: Api.projects.getProjectList,
        params: { pageSize: 100 },
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
        searchField: 'name',
        debounceTime: 300,
        allowClear: true,
      },
      rules: [
        { required: true, message: '请选择所属项目', trigger: 'change' },
      ],
    },
  ];
};
