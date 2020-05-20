/**
 * 作用: 请求参数 转换为 url
 */
export const queryToUrl = query => {
    if (!query) return ''

    const isKeepStay = val => {
        if (val === 0) return true
        if (!!val) return true
        return false
    }

    const keys = Object.keys(query).filter(key => isKeepStay(query[key]))
    if (keys.length <= 0) return ''

    let url = '?'
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index]
        const value = query[key]
        url += `${key}=${value}`
        url += index !== (keys.length - 1) ? '&' : ''
    }

    return url
}