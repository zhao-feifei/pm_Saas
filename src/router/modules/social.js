//导出社保的路由规则

import Layout from '@/layout'
export default {
  //路由规则
  path: '/social',
  name: 'social',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/social'),
      //路由的元信息
      meta: { title: '社保' } //左侧导航区域读取领这个title属性
    }
  ]
}
