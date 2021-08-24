//导出审批的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/approvals',
  name: 'approvals',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      //路由的元信息
      meta: { title: '审批' } //左侧导航区域读取领这个title属性
    }
  ]
}
