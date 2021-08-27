import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
//新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data: data
  })
}

//获取部门详情

export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

//保存编辑的数据
export function updateDepartments() {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
