//导出权限管理的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      //路由的元信息
      meta: { title: '权限管理', icon: 'lock' } //左侧导航区域读取领这个title属性
    }
  ]
}
