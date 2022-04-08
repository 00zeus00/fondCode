import request from '@/utils/request'

export function resetpassword(data) {
  return request({
    url: '/sysUser/resetPwd',
    method: 'post',
    data
  })
}