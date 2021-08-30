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

//删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

//新增员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
