import type {FormSchema} from '@/components/core/schema-form/';
import { ref, watch } from 'vue';
import Api from '@/api/';

// 服务对象选项类型
interface ServiceObjectOption {
  label: string;
  value: number;
}

export const requirementPoolSchemas = (): FormSchema<Record<string, any>>[] => {
  // 服务对象下拉选项
  const serviceObjectOptions = ref<ServiceObjectOption[]>([]);
  
  // 加载服务对象数据
  const loadServiceObjects = async () => {
    try {
      const response = await Api.serviceObjects.getServiceObjectList({ pageSize: 1000 });
      serviceObjectOptions.value = response.items.map(item => ({
        label: item.name,
        value: item.id
      }));
    } catch (error) {
      console.error('加载服务对象数据失败:', error);
    }
  };
  
  // 初始化加载服务对象数据
  loadServiceObjects();
  
  return [
    {
        field: 'name',
        component: 'Input',
        label: '需求池名称',
        rules: [{required: true, type: 'string', message: '请输入需求池名称'}],
        colProps: {
            span: 12,
        },
    },
    {
        field: 'serviceObjectId',
        component: 'Select',
        label: '关联服务对象',
        rules: [{required: true, type: 'number', message: '请选择关联服务对象'}],
        componentProps: {
            options: serviceObjectOptions.value,
            placeholder: '请选择服务对象',
        },
        colProps: {
            span: 12,
        },
    },
    {
        field: 'description',
        component: 'InputTextArea',
        label: '需求池描述',
        componentProps: {
            placeholder: '请输入需求池描述',
            rows: 4,
        },
        colProps: {
            span: 24,
        },
    },
  ];
};
