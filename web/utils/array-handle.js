/**
 * 含义: 根据下标删除数组
 */
export const arrayRemoveItemByIndex = (_array, index) => {
    const myArray = JSON.parse(JSON.stringify(_array))
    myArray.splice(index, 1)
    return myArray
}

/**
 * 含义: 根据数组的值删除
 */
export const arrayRemoveItemByValue = (_array, val) => {
    const index = _array.indexOf(val)

    /** 含义: 表示删除失败 */
    if (index === -1) return _array

    return arrayRemoveItemByIndex(_array, index)
}