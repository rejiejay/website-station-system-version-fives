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
    getListSortStorage: ({ defaultValue }) => {},
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
}

export default utils