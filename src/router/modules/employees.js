//导出员工的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/employees'),
      //路由的元信息
      meta: { title: '员工管理', icon: 'people' } //左侧导航区域读取领这个title属性
    },
    {
      path: 'detail/:id?',
      component: () => import('@/views/employees/detail'),
      hidden: true, //该内容不再左侧菜单显示
      meta: { title: '员工详情' }
    }
  ]
}
