import type {FormSchema} from '@/components/core/schema-form/';
import Api from '@/api/';

export const requirementPoolSchemas = (): FormSchema<Record<string, any>>[] => {
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
        component: 'ApiSelect',
        label: '关联服务对象',
        rules: [{required: true, type: 'number', message: '请选择关联服务对象'}],
        componentProps: {
            placeholder: '请选择服务对象',
            api: Api.serviceObjects.getServiceObjectList,
            params: { pageSize: 100 },
            resultField: 'items',
            labelField: 'name',
            valueField: 'id',
            searchField: 'name',
            debounceTime: 300,
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
