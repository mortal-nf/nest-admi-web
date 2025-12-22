import type {FormSchema} from '@/components/core/schema-form/';

export const serviceObjectSchemas = (): FormSchema<Record<string, any>>[] => [
    {
        field: 'name',
        component: 'Input',
        label: '服务对象名称',
        rules: [{required: true, type: 'string', message: '请输入服务对象名称'}],
        colProps: {
            span: 12,
        },
    },
    {
        field: 'enabled',
        component: 'Switch',
        label: '是否启用',
        defaultValue: '1',
        rules: [{required: true, type: 'string', message: '请选择是否启用'}],
        componentProps: {
            checkedValue: '1',
            unCheckedValue: '0',
        },
        colProps: {
            span: 12,
        },
    },
    {
        field: 'description',
        component: 'InputTextArea',
        label: '服务对象描述',
        componentProps: {
            placeholder: '请输入服务对象描述',
            rows: 4,
        },
        colProps: {
            span: 24,
        },
    },
];
