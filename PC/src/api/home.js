import request from '@/utils/request'
// 首页柱状图
export function getEcharts(query) {
  return request({
    url: '/scoreApplyRecord/search',
    method: 'get',
    params: query
  })
}
// 待处理订单
export function toDo(query) {
  return request({
    url: '/pendingOrder',
    method: 'post',
    params: query
  })
}