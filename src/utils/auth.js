import Cookies from 'js-cookie'

//设置一个独一无二的
const TokenKey = 'zhao-feifei'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
