/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 密码正则校验:密码为6-20位，不允许出现空字符
 * @param {string} str
 * @returns {Boolean}
 */
export function checkPwd(str) {
  // const reg = /^[^ ]{6,20}$/
  // 6-20位 大小写字母和数字
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{6,20}$/  
  return reg.test(str)
}

/**
 * 手机号码验证(11位数字)
 * @param {string} str
 * @returns {Boolean}
 */
export function checkPhone(str) {
  const reg = /^([1][\d]{10})$/
  return reg.test(str)
}

/**
 * 邮箱正则校验
 * @param {string} str
 * @returns {Boolean}
 */
export function checkEmail(str) {
  const reg = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]+@([a-zA-Z0-9]+[a-zA-Z0-9_-]+\.)+[a-z]{2,}$/
  return reg.test(str)
}

/**
 * 名称
 * 支持中文、英文限制0-20位
 * @param {string} str
 * @returns {Boolean}
 */
export function checkAccountName(str) {
  const reg = /^[a-zA-Z\u4e00-\u9fa5]{0,20}$/
  return reg.test(str)
}

/**
 * 名称
 * 6-20位，仅限英文、数字和下划线
 * @param {string} str
 * @returns {Boolean}
 */
 export function checkAccount(str) {
  const reg = /^[0-9_a-zA-Z]{6,20}$/
  return reg.test(str)
}

/**
 * 名称
 * 支持_、英文限制1-40位
 * @param {string} str
 * @returns {Boolean}
 */
 export function checkProductFlag(str) {
  const reg = /^[a-zA-Z_]{1,40}$/
  return reg.test(str)
}
