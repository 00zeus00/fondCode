import request from '@/utils/request'
// 查询统计列表
export function getAllData(data) {
  return request({
    url: '/employee/search/',
    method: 'post',
    data
  })
}
// 冻结积分
export function getFrozen(data) {
  return request({
    url: '/score/freeze/',
    method: 'post',
    data
  })
}
// 解冻积分
export function getUnFrozen(data) {
  return request({
    url: '/score/unfreeze',
    method: 'post',
    data
  })
}