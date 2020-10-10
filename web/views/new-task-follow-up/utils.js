import uiStorage from './../../components/ui-storage/index';

function initLayoutRef(self) {
    self.taskListRef = React.createRef()
    self.taskDetailModalRef = React.createRef()
    self.targetMindListSelectModalRef = React.createRef()
    self.targetMindDetailSelectModalRef = React.createRef()
    self.tipModalRef = React.createRef()
    self.statisticsModalRef = React.createRef()
}

function getShowTaskWayStorage({ defaultValue }) {
    const showTaskWay = uiStorage.getShowTaskWay()
    if (showTaskWay) return showTaskWay
    return defaultValue
}

function getListSortStorage({ defaultValue }) {
    const sort = uiStorage.getTaskListSort()
    if (sort) return sort
    return defaultValue
}

function getMTGTRidStorage() {
    const mindTargetGroupTaskRootId = uiStorage.getMTGTRid()
    if (mindTargetGroupTaskRootId) return mindTargetGroupTaskRootId
    return null
}

function storageShowTaskWay({ showTaskWay, groupId, self }) {
    self.showTaskWay = showTaskWay
    self.mindTargetGroupTaskRootId = groupId
    uiStorage.setShowTaskWay({ showTaskWay, groupId })
}

function getTaskRenderList({ pageStatus, allTaskList, groupTaskList, isShowPutOff }) {
    if (pageStatus === 'showGroup') return groupTaskList
    return allTaskList
}

function getTaskListLeftOperation(pageStatus, leftButtonFun) {
    if (pageStatus === 'showGroup') return leftButtonFun
    return false
}

const utils = {
    initLayoutRef,

    getShowTaskWayStorage,

    getListSortStorage,

    getMTGTRidStorage,

    storageShowTaskWay,

    renderTaskListStyle: isShow => ({ display: isShow ? 'block' : 'none' }),

    getTaskRenderList,

    getPutOffStorage: () => {},

    // for persistence, because today just need get one time
    getTodayGroupTaskRootId: async() => {},

    isAddTaskToday: showTaskWay => {},

    getTaskListLeftOperation
}

export default utils