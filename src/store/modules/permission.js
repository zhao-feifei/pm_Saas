//专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...newRoutes]
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  //筛选权限路由
  //第二个参数为当前用户拥有的权限
  //asyncRoutes是所有的动态路由
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
      //得到的routers就是用户拥有的动态路由权限
    })
    context.commit('setRoutes', routes) //mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
