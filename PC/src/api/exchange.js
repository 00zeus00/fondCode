import request from '@/utils/request'
// 查询兑换列表
export function getAllData(query) {
  return request({
    url: '/scoreExchangeRecord/search',
    method: 'get',
    // params: {pageSize:10,pageNo:1}
    params: query
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/getCurrentLoginUserInfo',
//     method: 'get',
//     params: { token }
//   })
// }
