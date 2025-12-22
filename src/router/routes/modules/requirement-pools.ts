import type { RouteRecordRaw } from 'vue-router';


const moduleName = 'requirement-pools';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/requirement-pools',
    name: moduleName,
    redirect: '/requirement-pools/list',
    meta: {
      title: '需求池管理' ,
      icon: 'ant-design:database-outlined',
      breadcrumb: false,
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: '需求池列表',
          icon: 'ant-design:database-outlined',
          keepAlive: true,
          cacheMenu: true,
          requiresAuth: true,
          permissions: ['requirement-pools:list'],
        },
        component: () => import('@/views/requirement-pool/index.vue'),
      },
    ],
  },
];

export default routes;
