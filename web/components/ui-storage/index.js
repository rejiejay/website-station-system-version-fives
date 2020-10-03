const getValue = key => {
    const itme = window.localStorage[key]
    if (!itme && itme !== 'null') return itme
    return false
}

const config = {
    taskListSort: 'task-list-sort',
    showTaskWay: 'task-layout-show-task-way',
    mindTargetGroupTaskRootId: 'task-layout-mind-target-group-task-root-id',
}

const uiStorage = {
    getTaskListSort: () => getValue(config.taskListSort),
    getShowTaskWay: () => getValue(config.showTaskWay),
    getMTGTRid: () => getValue(config.mindTargetGroupTaskRootId),
    setShowTaskWay: ({ showTaskWay, groupId }) => {
        window.localStorage[config.showTaskWay] = showTaskWay
        window.localStorage[config.mindTargetGroupTaskRootId] = groupId
    },
}

export default uiStorage