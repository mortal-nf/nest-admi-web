import type { RouteRecordRaw } from 'vue-router';

const moduleName = 'taskNodes';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/task-nodes',
    name: moduleName,
    redirect: '/task-nodes/list',
    meta: {
      title: '任务节点管理',
      icon: 'ant-design:api-outlined',
      breadcrumb: false,
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: '任务节点列表',
          icon: 'ant-design:api-outlined',
          keepAlive: true,
          cacheMenu: true,
          requiresAuth: true,
          permissions: ['taskNodes:list'],
        },
        component: () => import('@/views/task-nodes/index.vue'),
      },
    ],
  },
];

export default routes;