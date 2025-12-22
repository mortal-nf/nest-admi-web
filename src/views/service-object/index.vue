<template>
  <DynamicTable header-title="服务对象管理" show-index title-tooltip="服务对象管理模块，用于创建、编辑和删除服务对象。" :data-request="loadTableData"
    :columns="columns" :scroll="{ x: 1200 }" :row-selection="rowSelection">
    <template v-if="isCheckRows" #title>
      <Alert class="w-full" type="info" show-icon>
        <template #message>
          已选 {{ isCheckRows }} 项
          <a-button type="link" @click="rowSelection.selectedRowKeys = []">取消选择</a-button>
        </template>
      </Alert>
    </template>
    <template #toolbar>
      <a-button type="primary" @click="openServiceObjectModal({})">
        <Icon icon="ant-design:plus-outlined" />
        新增
      </a-button>
      <a-button type="error" :disabled="!isCheckRows" @click="delRowConfirm(rowSelection.selectedRowKeys)">
        <Icon icon="ant-design:delete-outlined" />
        删除
      </a-button>
    </template>
  </DynamicTable>
</template>

<script setup lang="tsx">
import { computed, ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Alert, Modal } from 'ant-design-vue';
import { serviceObjectSchemas } from './formSchemas';
import { baseColumns, type TableColumnItem, type TableListItem } from './columns';
import type { LoadDataParams } from '@/components/core/dynamic-table';
import { useTable } from '@/components/core/dynamic-table';
import Api from '@/api/';
import { useFormModal } from '@/hooks/useModal/';

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: {
    autoSubmitOnEnter: true,
    schemas: [
      { field: 'name', component: 'Input', label: '服务对象名称', colProps: { span: 8 } },
      { field: 'enabled', component: 'Select', label: '状态', componentProps: { options: [{ label: '启用', value: '1' }, { label: '禁用', value: '0' }] }, colProps: { span: 8 } }
    ]
  }
});

const [showModal] = useFormModal();

const rowSelection = ref({
  selectedRowKeys: [] as number[],
  onChange: (selectedRowKeys: number[], selectedRows: TableListItem[]) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys;
  },
});

// 是否勾选了表格行
const isCheckRows = computed(() => rowSelection.value.selectedRowKeys.length);

const loadTableData = async (params: LoadDataParams) => {
  // 将前端 DynamicTable 的 current/limit 转换为后端的 page/pageSize
  const { current, limit, ...restParams } = params;
  const apiParams = {
    ...restParams,
    page: current,
    pageSize: limit
  };
  const data = await Api.serviceObjects.getServiceObjectList(apiParams);
  rowSelection.value.selectedRowKeys = [];
  return data;
};

/**
 * @description 打开操作服务对象弹窗
 */
const openServiceObjectModal = async (record: Partial<TableListItem> = {}) => {
  const isUpdate = Boolean(record.id);
  const [formRef] = await showModal({
    modalProps: {
      title: `${isUpdate ? '编辑' : '新增'}服务对象`,
      width: 700,
      onFinish: async (values) => {
        try {
          if (isUpdate) {
            await Api.serviceObjects.updateServiceObject(record.id!, values as any);
          } else {
            await Api.serviceObjects.createServiceObject(values as any);
          }
          dynamicTableInstance?.reload();
        } catch (error) {
          console.error('操作失败:', error);
          return false;
        }
      },
    },
    formProps: {
      labelWidth: 100,
      schemas: serviceObjectSchemas(),
      autoSubmitOnEnter: true,
    },
  });

  // 如果是编辑模式，获取详情并设置表单值
  if (isUpdate && record.id) {
    const detail = await Api.serviceObjects.getServiceObjectDetail(record.id);
    formRef?.setFieldsValue(detail);
  }
};

/**
 * @description 删除数据确认
 */
const delRowConfirm = async (ids: number[]) => {
  const confirm = await Modal.confirm({
    title: '确认删除',
    icon: <ExclamationCircleOutlined />,
    content: `确定要删除选中的${ids.length}条数据吗？此操作不可撤销。`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
  });

  if (confirm) {
    try {
      for (const id of ids) {
        await Api.serviceObjects.deleteServiceObject(id);
      }
      dynamicTableInstance?.reload();
    } catch (error) {
      console.error('删除失败:', error);
    }
  }
};

// 配置表格列，添加操作列回调
const columns: TableColumnItem[] = [
  ...baseColumns,
  {
    title: '操作',
    width: 200,
    dataIndex: 'ACTION',
    fixed: 'right',
    hideInSearch: true,
    actions: ({ record }) => [
      {
        label: '查看',
        onClick: () => console.log('查看详情:', record),
      },
      {
        label: '编辑',
        onClick: () => openServiceObjectModal(record),
      },
      {
        label: '删除',
        color: 'red',
        popConfirm: {
          title: '你确定要删除吗？',
          placement: 'left',
          onConfirm: () => delRowConfirm([record.id]),
        },
      },
    ],
  },
];
</script>

<style scoped>
/* 可以在这里添加组件特定的样式 */
</style>
