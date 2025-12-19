import { request } from '@/utils/request';

export type DictType = string;

export async function getDictData(params: { type: DictType }) {
  return request<LabelValueOptions>({
    url: '/api/system/dict-type/data',
    method: 'GET',
    params,
  });
}
