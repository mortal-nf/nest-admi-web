import { request } from '@/utils/request';

// 任务节点状态类型
export type TaskNodeStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'blocked';

// 任务节点数据类型
export interface TaskNode {
  id: number;
  title: string;
  description?: string;
  status: TaskNodeStatus;
  order: number;
  dueDate?: string;
  actualCompletionDate?: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
  project?: {
    id: number;
    name: string;
  };
}

// 创建任务节点请求参数
export interface CreateTaskNodeRequest {
  title: string;
  description?: string;
  status?: TaskNodeStatus;
  order?: number;
  dueDate?: string;
  actualCompletionDate?: string;
  projectId: number;
}

// 更新任务节点请求参数
export interface UpdateTaskNodeRequest {
  title?: string;
  description?: string;
  status?: TaskNodeStatus;
  order?: number;
  dueDate?: string;
  actualCompletionDate?: string;
  projectId?: number;
}

// 任务节点查询参数
export interface TaskNodeQueryParams {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: TaskNodeStatus;
  projectId?: number;
}

// 创建任务节点
export const createTaskNode = (data: CreateTaskNodeRequest) => {
  return request<TaskNode>({ url: '/api/task-nodes', method: 'POST', data });
};

// 获取任务节点列表
export const getTaskNodeList = (params: TaskNodeQueryParams) => {
  return request<{ items: TaskNode[]; total: number }>({ url: '/api/task-nodes', method: 'GET', params });
};

// 获取任务节点详情
export const getTaskNodeDetail = (id: number) => {
  return request<TaskNode>({ url: `/api/task-nodes/${id}`, method: 'GET' });
};

// 更新任务节点
export const updateTaskNode = (id: number, data: UpdateTaskNodeRequest) => {
  return request<TaskNode>({ url: `/api/task-nodes/${id}`, method: 'PATCH', data });
};

// 删除任务节点
export const deleteTaskNode = (id: number) => {
  return request({ url: `/api/task-nodes/${id}`, method: 'DELETE' });
};

export default {
  createTaskNode,
  getTaskNodeList,
  getTaskNodeDetail,
  updateTaskNode,
  deleteTaskNode,
};
