import request from '@/utils/request'

// 项目列表查询
export function getAllData(query) {
  // debugger
  return request({
    url: '/sysUser/page',
    method: 'get',
    params: query
  })
}
// 新增管理员
// export function addAdmin(data) {
//   // debugger
//   return request({
//     url: '',
//     method: 'post',
//     data
//   })
// }
// 修改密码
export function updateAdmin(data) {
  // debugger
  return request({
    url: '/sysUser/updatePassword',
    method: 'post',
    data
  })
}