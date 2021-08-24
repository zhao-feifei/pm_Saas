//导出考勤的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      //路由的元信息
      meta: { title: '考勤', icon: 'skill' } //左侧导航区域读取领这个title属性
    }
  ]
}
