import uiStorage from './../../components/ui-storage/index';

const utils = {
    initLayoutRef: self => {
        self.taskListRef = React.createRef()
        self.taskDetailModalRef = React.createRef()
        self.targetMindListSelectModalRef = React.createRef()
        self.targetMindDetailSelectModalRef = React.createRef()
        self.tipModalRef = React.createRef()
        self.statisticsModalRef = React.createRef()
    },

    getShowTaskWayStorage: ({ defaultValue }) => {
        const showTaskWay = uiStorage.getShowTaskWay()
        if (showTaskWay) return showTaskWay
        return defaultValue
    },
    getListSortStorage: ({ defaultValue }) => {
        const sort = uiStorage.getTaskListSort()
        if (sort) return sort
        return defaultValue
    },
    getMTGTRidStorage: () => {
        const mindTargetGroupTaskRootId = uiStorage.getMTGTRid()
        if (mindTargetGroupTaskRootId) return mindTargetGroupTaskRootId
        return null
    },
    storageShowTaskWay: ({ showTaskWay, groupId, self }) => {
        self.showTaskWay = showTaskWay
        self.mindTargetGroupTaskRootId = groupId
        uiStorage.setShowTaskWay({ showTaskWay, groupId })
    },
    renderTaskListStyle: isShow => ({ display: isShow ? 'block' : 'none' }),
    getTaskRenderList: ({ pageStatus, allTaskList, groupTaskList, isShowPutOff }) => {
        if (pageStatus === 'showGroup') return groupTaskList
        return allTaskList
    },
    getPutOffStorage: () => {},
    // for persistence, because today just need get one time
    getTodayGroupTaskRootId: async() => {},
    isAddTaskToday: showTaskWay => {},
    getTaskListLeftOperation: (pageStatus, leftButtonFun) => {
        if (pageStatus === 'showGroup') return leftButtonFun
        return false
    }
}

export default utils