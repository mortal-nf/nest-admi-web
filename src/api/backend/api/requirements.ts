import { request } from '@/utils/request';

// 需求状态类型
export type RequirementStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'blocked';

// 需求优先级类型
export type RequirementPriority = 'low' | 'medium' | 'high' | 'urgent';

// 需求数据类型
export interface Requirement {
  id: number;
  title: string;
  description?: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  progress: number;
  requirementPoolId: number;
  projectId?: number;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
  requirementPool?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

// 创建需求请求参数
export interface CreateRequirementRequest {
  title: string;
  description?: string;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  progress?: number;
  requirementPoolId: number;
  projectId?: number;
}

// 更新需求请求参数
export interface UpdateRequirementRequest {
  title?: string;
  description?: string;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  progress?: number;
  requirementPoolId?: number;
  projectId?: number;
}

// 需求查询参数
export interface RequirementQueryParams {
  page?: number;
  pageSize?: number;
  title?: string;
  status?: RequirementStatus;
  priority?: RequirementPriority;
  requirementPoolId?: number;
  projectId?: number;
}

// 创建需求
export const createRequirement = (data: CreateRequirementRequest) => {
  return request<Requirement>({ url: '/api/requirements', method: 'POST', data });
};

// 获取需求列表
export const getRequirementList = (params: RequirementQueryParams) => {
  return request<{ items: Requirement[]; total: number }>({ url: '/api/requirements', method: 'GET', params });
};

// 获取需求详情
export const getRequirementDetail = (id: number) => {
  return request<Requirement>({ url: `/api/requirements/${id}`, method: 'GET' });
};

// 更新需求
export const updateRequirement = (id: number, data: UpdateRequirementRequest) => {
  return request<Requirement>({ url: `/api/requirements/${id}`, method: 'PATCH', data });
};

// 删除需求
export const deleteRequirement = (id: number) => {
  return request({ url: `/api/requirements/${id}`, method: 'DELETE' });
};

export default {
  createRequirement,
  getRequirementList,
  getRequirementDetail,
  updateRequirement,
  deleteRequirement,
};
