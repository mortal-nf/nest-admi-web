import type { RouteRecordRaw } from 'vue-router';


const moduleName = 'service-objects';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/service-objects',
    name: moduleName,
    redirect: '/service-objects/list',
    meta: {
      title: '服务对象管理' ,
      icon: 'ant-design:appstore-outlined',
      breadcrumb: false,
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: '服务对象列表',
          icon: 'ant-design:appstore-outlined',
          keepAlive: true,
          cacheMenu: true,
          requiresAuth: true,
          permissions: ['service-objects:list'],
        },
        component: () => import('@/views/service-object/index.vue'),
      },
    ],
  },
];

export default routes;
