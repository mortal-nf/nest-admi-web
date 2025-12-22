import { request } from '@/utils/request';

// 服务对象数据类型
export interface ServiceObject {
  id: number;
  name: string;
  description?: string;
  enabled: string;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
}

// 创建服务对象请求参数
export interface CreateServiceObjectRequest {
  name: string;
  description?: string;
  enabled?: string;
}

// 更新服务对象请求参数
export interface UpdateServiceObjectRequest {
  name?: string;
  description?: string;
  enabled?: string;
}

// 服务对象查询参数
export interface ServiceObjectQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  enabled?: string;
}

// 创建服务对象
export const createServiceObject = (data: CreateServiceObjectRequest) => {
  return request<ServiceObject>({ url: '/api/service-objects', method: 'POST', data });
};

// 获取服务对象列表
export const getServiceObjectList = (params: ServiceObjectQueryParams) => {
  return request<{ items: ServiceObject[]; total: number }>({ url: '/api/service-objects', method: 'GET', params });
};

// 获取服务对象详情
export const getServiceObjectDetail = (id: number) => {
  return request<ServiceObject>({ url: `/api/service-objects/${id}`, method: 'GET' });
};

// 更新服务对象
export const updateServiceObject = (id: number, data: UpdateServiceObjectRequest) => {
  return request<ServiceObject>({ url: `/api/service-objects/${id}`, method: 'PUT', data });
};

// 删除服务对象
export const deleteServiceObject = (id: number) => {
  return request({ url: `/api/service-objects/${id}`, method: 'DELETE' });
};

export default {
  createServiceObject,
  getServiceObjectList,
  getServiceObjectDetail,
  updateServiceObject,
  deleteServiceObject,
};
