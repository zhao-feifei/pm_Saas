import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() //初始化vuex时从缓存中读取
}
const mutations = {
  setToken(state, token) {
    state.token = token //将数据设置给vuex
    setToken(token) //同步到缓存
  },
  removeToken(token) {
    state.token = null //置空后同步到缓存
    removeToken()
  }
}
const actions = {
  async login(context, data) {
    //调用api接口
    const result = await login(data)

    context.commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
