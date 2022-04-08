import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/loginApi',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/getCurrentLoginUserInfo',
    method: 'get',
    params: { token }
  })
}

export function getUserInfo() {
  return request({
    url: '/sysUser/currentUserInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logoutAction',
    method: 'post'
  })
}

export function getAuthentication() {
  return request({
    url: '/authentication/info',
    method: 'get'
  })
}