import request from '@/utils/request'
// 查询订单列表
export function getAllData(query) {
  return request({
    url: '/order/search',
    method: 'get',
    params: query
  })
}
// 填写物流信息
export function wuliu(data) {
  return request({
    url: '/express/update',
    method: 'post',
    data
  })
}
// 确认收货
export function orderState(data) {
  return request({
    url: '/order/confirm',
    method: 'post',
    data
  })
}