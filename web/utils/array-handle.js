/**
 * 含义: 根据下标删除数组
 */
export const arrayRemoveItemByIndex = (list, index) => {
    const myArray = JSON.parse(JSON.stringify(list))
    myArray.splice(index, 1)
    return myArray
}

/**
 * 含义: 根据数组的值删除
 */
export const arrayRemoveItemByValue = (list, val) => {
    const index = list.indexOf(val)

    /** 含义: 表示删除失败 */
    if (index === -1) return list

    return arrayRemoveItemByIndex(list, index)
}

/**
 * 含义: 根据Key值去重
 */
export const arrayDuplicateByKey = (list, key) => {
    const filters = new Set()

    return list.filter(item => {
        const isRepeat = !Array.from(filters).includes(item[key])
        filters.add(item[key])
        return isRepeat
    })
}