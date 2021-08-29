import request from '@/utils/request'
//员工简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

//员工综合列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}
