<template>
  <DynamicTable header-title="任务节点管理" show-index title-tooltip="任务节点管理模块，用于管理项目中的任务节点。" :data-request="loadTableData"
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
      <a-button type="primary" @click="openTaskNodeModal({})">
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
import { computed, onMounted, ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Alert, Modal } from 'ant-design-vue';
import { taskNodeSchemas } from './formSchemas';
import { baseColumns, type TableColumnItem, type TableListItem } from './columns.tsx';
import type { LoadDataParams } from '@/components/core/dynamic-table';
import { useTable } from '@/components/core/dynamic-table';
import Api from '@/api/';
import { useFormModal } from '@/hooks/useModal/';

const [DynamicTable, dynamicTableInstance] = useTable({
  formProps: {
    autoSubmitOnEnter: true,
    schemas: [
      { field: 'title', component: 'Input', label: '任务标题', colProps: { span: 8 } },
      { field: 'status', component: 'Select', label: '状态', componentProps: { 
        options: [
          { label: '待处理', value: 'pending' },
          { label: '处理中', value: 'processing' },
          { label: '已完成', value: 'completed' },
          { label: '已取消', value: 'cancelled' },
          { label: '已阻塞', value: 'blocked' },
        ]
      }, colProps: { span: 8 } },
      // { field: 'projectId', component: 'Select', label: '所属项目', componentProps: { 
      //   options: async () => {
      //     try {
      //       const data = await Api.projects.getProjectList({ pageSize: 1000 });
      //       return data.items.map(item => ({ label: item.name, value: item.id }));
      //     } catch (error) {
      //       console.error('获取项目列表失败:', error);
      //       return [];
      //     }
      //   }
      // }, colProps: { span: 8 } },
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
  const data = await Api.taskNodes.getTaskNodeList(apiParams);
  rowSelection.value.selectedRowKeys = [];
  return data;
};

/**
 * @description 打开操作任务节点弹窗
 */
const openTaskNodeModal = async (record: Partial<TableListItem> = {}) => {
  const isUpdate = Boolean(record.id);
  const [formRef] = await showModal({
    modalProps: {
      title: `${isUpdate ? '编辑' : '新增'}任务节点`,
      width: 700,
      onFinish: async (values) => {
        try {
          if (isUpdate) {
            await Api.taskNodes.updateTaskNode(record.id!, values as any);
          } else {
            await Api.taskNodes.createTaskNode(values as any);
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
      schemas: taskNodeSchemas(),
      autoSubmitOnEnter: true,
    },
  });

  // 如果是编辑模式，获取详情并设置表单值
  if (isUpdate && record.id) {
    const detail = await Api.taskNodes.getTaskNodeDetail(record.id);
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
        await Api.taskNodes.deleteTaskNode(id);
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
        onClick: () => openTaskNodeModal(record),
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
