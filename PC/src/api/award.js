import request from '@/utils/request'
// 查询奖品列表
export function getAllData(query) {
  return request({
    url: '/AwardManageInformation/showAllAward',
    method: 'get',
    params: query
  })
}
// 新增奖品
export function addAward(data) {
  return request({
    url: '/AwardManageInformation/add',
    method: 'post',
    data
  })
}

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