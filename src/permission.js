import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '404']

router.beforeEach(async (to, from, next) => {
  //开启进度条
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      //只有放过的时候采取获取用户资料
      //如果当前vuex中有用户的id就不用再次获取了
      //没有则获取用户资料
      if (!store.getters.userId) {
        //强制变成同步代码
        //async函数return的内容用await就能接收
        const { roles } = await store.dispatch('user/getUserInfo')
        //筛选用户的可用路由
        const routes = await store.dispatch(
          'permission/filterRoutes',
          roles.menus
        )
        //routes就是筛选得到的动态路由
        router.addRoutes(routes) //添加动态路由到路由表
        next(to.path)
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
router.afterEach(() => {
  NProgress.done()
})
