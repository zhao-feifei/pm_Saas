import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
