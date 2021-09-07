import { config } from '@vue/test-utils'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
import { Message } from 'element-ui'

const TimeOut = 7200 //token超时时间  单位是秒

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  //设置超时时间
  timeout: 5000
})
//请求拦截器
service.interceptors.request.use(
  config => {
    //注入token
    if (store.getters.token) {
      //有token时   检查时间戳是否超时
      if (isCheckTimeOut()) {
        //时间戳过期
        store.dispatch('user/logout') // 登出
        //跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message, data } = response.data
    if (success) {
      console.log(data)
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  error => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 1002
    ) {
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject()
  }
)

//检查token是否超时的函数
function isCheckTimeOut() {
  let currentTime = Date.now()
  let timestamp = getTimeStamp()
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service
