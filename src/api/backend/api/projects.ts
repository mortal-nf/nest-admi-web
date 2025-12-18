import { request } from '@/utils/request';

// 项目状态类型
export type ProjectStatus = 'planning' | 'in_progress' | 'overdue' | 'completed' | 'archived' | 'cancelled' | 'paused';

// 项目数据类型
export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  requirementPoolId?: number;
  serviceObjectId?: number;
  createdAt: string;
  updatedAt: string;
  creatorId?: number;
  updaterId?: number;
}

// 创建项目请求参数
export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  requirementPoolId?: number;
  serviceObjectId?: number;
}

// 更新项目请求参数
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  requirementPoolId?: number;
  serviceObjectId?: number;
}

// 项目查询参数
export interface ProjectQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

// 创建项目
export const createProject = (data: CreateProjectRequest) => {
  return request<Project>({ url: '/api/projects', method: 'POST', data });
};

// 获取项目列表
export const getProjectList = (params: ProjectQueryParams) => {
  return request<{ items: Project[]; total: number }>({ url: '/api/projects', method: 'GET', params });
};

// 获取项目详情
export const getProjectDetail = (id: number) => {
  return request<Project>({ url: `/api/projects/${id}`, method: 'GET' });
};

// 更新项目
export const updateProject = (id: number, data: UpdateProjectRequest) => {
  return request<Project>({ url: `/api/projects/${id}`, method: 'PUT', data });
};

// 删除项目
export const deleteProject = (id: number) => {
  return request({ url: `/api/projects/${id}`, method: 'DELETE' });
};

export default {
  createProject,
  getProjectList,
  getProjectDetail,
  updateProject,
  deleteProject,
};
