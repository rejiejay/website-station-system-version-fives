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

    getShowTaskWayStorage: ({ defaultValue }) => {},
    getListSortStorage: ({ defaultValue }) => {
        const sort = uiStorage.getTaskListSort()
        if (sort) return sort
        return defaultValue
    },
    getMTGTRidStorage: () => {},
    storageShowTaskWay: ({ showTaskWay, groupId, self }) => {},
    renderTaskListStyle: isShow => ({ display: isShow ? 'block' : 'none' }),
    getTaskListShowAllData: slef => {
        const { allTaskList } = slef.state
        const isInitAllTask = allTaskList.length > 0
        return {
            isInitAllTask,
            state: { isShow: true }
        }
    },
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