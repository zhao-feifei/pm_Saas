//导出组织架构的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/departments'),
      //路由的元信息
      meta: { title: '组织架构', icon: 'tree' } //左侧导航区域读取领这个title属性
    }
  ]
}
