/**
 * 含义: 对象值转为数组
 */
export const objValueToArray = obj => Object.keys(obj).map(key => obj[key])