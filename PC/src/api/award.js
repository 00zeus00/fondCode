import request from '@/utils/request'
// 查询奖品列表
export function getAllData(query) {
  return request({
    url: '/AwardManageInformation/showAllAward',
    method: 'get',
    params: query
  })
}
// 上下两种方法都可以，这是关于get方法的,
// 一般在获取的时候都用get，关键还在于后端的接口是get还是post
// export const getAllData = params => {
//     return request({
//        url:'/AwardManageInformation/showAllAward' + params,
//        method:'get',
//    })
// }
// 新增奖品
export function addAward(data) {
  return request({
    url: '/AwardManageInformation/add',
    method: 'post',
    data
  })
}
//上下两种方法都可以，这是关于get方法的,
// 一般在提交的时候都用post，关键还在于后端的接口是get还是post
// export const addAward = data => {
//     return request({
//        url:'/AwardManageInformation/add',
//        method:'post',
//        data
//    })
// }
// 奖品上下架 
export function awardState(data) {
  return request({
    url: '/AwardManageInformation/upAndDownAward',
    method: 'post',
    data
  })
}
// 新增图片
export function addPicture(data) {
  // debugger
  return request({
    url: '/PictureInformation/add',
    method: 'post',
    data
  
  })
}