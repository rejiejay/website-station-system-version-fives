const getValue = key => {
    const itme = window.localStorage[key]
    if (!itme && itme !== 'null') return itme
    return false
}

const uiStorage = {
    getTaskListSort: () => getValue('task-list-sort')
}

export default uiStorage