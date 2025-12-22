import { request } from '@/utils/request';

// 需求池数据类型
export interface RequirementPool {
  id: number;
  name: string;
  serviceObjectId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
  serviceObject?: {
    id: number;
    name: string;
  };
}

// 创建需求池请求参数
export interface CreateRequirementPoolRequest {
  name: string;
  serviceObjectId: number;
  description?: string;
}

// 更新需求池请求参数
export interface UpdateRequirementPoolRequest {
  name?: string;
  serviceObjectId?: number;
  description?: string;
}

// 需求池查询参数
export interface RequirementPoolQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  serviceObjectId?: number;
}

// 创建需求池
export const createRequirementPool = (data: CreateRequirementPoolRequest) => {
  return request<RequirementPool>({ url: '/api/requirement-pools', method: 'POST', data });
};

// 获取需求池列表
export const getRequirementPoolList = (params: RequirementPoolQueryParams) => {
  return request<{ items: RequirementPool[]; total: number }>({ url: '/api/requirement-pools', method: 'GET', params });
};

// 获取需求池详情
export const getRequirementPoolDetail = (id: number) => {
  return request<RequirementPool>({ url: `/api/requirement-pools/${id}`, method: 'GET' });
};

// 更新需求池
export const updateRequirementPool = (id: number, data: UpdateRequirementPoolRequest) => {
  return request<RequirementPool>({ url: `/api/requirement-pools/${id}`, method: 'PUT', data });
};

// 删除需求池
export const deleteRequirementPool = (id: number) => {
  return request({ url: `/api/requirement-pools/${id}`, method: 'DELETE' });
};

export default {
  createRequirementPool,
  getRequirementPoolList,
  getRequirementPoolDetail,
  updateRequirementPool,
  deleteRequirementPool,
};
