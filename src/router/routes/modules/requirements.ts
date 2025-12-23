import type { RouteRecordRaw } from 'vue-router';

const moduleName = 'requirements';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/requirements',
    name: moduleName,
    redirect: '/requirements/list',
    meta: {
      title: '需求管理',
      icon: 'ant-design:file-text-outlined',
      breadcrumb: false,
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: '需求列表',
          icon: 'ant-design:file-text-outlined',
          keepAlive: true,
          cacheMenu: true,
          requiresAuth: true,
          permissions: ['requirements:list'],
        },
        component: () => import('@/views/requirements/index.vue'),
      },
    ],
  },
];

export default routes;