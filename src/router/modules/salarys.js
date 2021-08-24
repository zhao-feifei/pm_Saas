//导出工资的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      //路由的元信息
      meta: { title: '工资' } //左侧导航区域读取领这个title属性
    }
  ]
}
