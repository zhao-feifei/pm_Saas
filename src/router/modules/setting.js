//导出公司设置的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/setting',
  name: 'setting',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/setting'),
      //路由的元信息
      meta: { title: '公司设置' } //左侧导航区域读取领这个title属性
    }
  ]
}
