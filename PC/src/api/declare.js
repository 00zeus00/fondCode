import request from '@/utils/request'
// 查询申报列表
export function getAllData(query) {
  return request({
    url: '/scoreApplyRecord/search',
    method: 'get',
    params: query
  })
}
// 申报同意
export function agreeDeclare(data){
  return request({
    url:'/scoreApplyRecord/agree',
    method:'post',
    data
  })
}
// 申报驳回
export function disagreeDeclare(data){
  return request({
    url:'/scoreApplyRecord/disagree',
    method: 'post',
    data
  })
}
// 批量同意与驳回
export function dealAllDeclare(data){
  return request({
    url:'/scoreApplyRecord/batch',
    method:'post',
    data
  })
}
