import type { RouteRecordRaw } from 'vue-router';


const moduleName = 'projects';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/projects',
    name: moduleName,
    redirect: '/projects/list',
    meta: {
      title: '项目管理' ,
      icon: 'ant-design:project-outlined',
      breadcrumb: false,
    },
    children: [
      {
        path: 'list',
        name: `${moduleName}-list`,
        meta: {
          title: '项目列表',
          icon: 'ant-design:project-outlined',
          keepAlive: true,
          cacheMenu: true,
          requiresAuth: true,
          permissions: ['projects:list'],
        },
        component: () => import('@/views/projects/index.vue'),
      },
    ],
  },
];

export default routes;
