import request from '@/utils/request'
// // 项目新增
export function addProject(data) {
  // debugger
  return request({
    url: '/item/add',
    method: 'post',
    data
  })
}
// 项目列表查询
export function getAllData(query) {
  return request({
    url: '/item/search',
    method: 'get',
    params: query
  })
}
// 项目变更
export function projectUpdate(data) {
  return request({
    url: '/item/update',
    method: 'post',
    data
  })
}
// 项目启用/禁用
export function projectState(data) {
  return request({
    url: '/item/stop',
    method: 'post',
    data
  })
}
