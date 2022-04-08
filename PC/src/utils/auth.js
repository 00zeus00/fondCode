import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUser(loginUser) {
  // loginUser=JSON.stringify(loginUser)
  return Cookies.set("loginUser", JSON.stringify(loginUser))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
