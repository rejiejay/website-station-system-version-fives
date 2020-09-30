import React, { useState, memo } from 'react'
import ReactDOM from 'react-dom'

const CONST = {
    SHOW_TASK_WAY: {
        DEFAULT: 'listAll',
        LIST_ALL: 'listAll', // default list all task
        LIST_MIND: 'listMind', // for list target group todo task
        MIND_TARGET_SELECT: 'mindTargetSelect', // for preview and select target group task
        MIND_DETAIL_SELECT: 'mindDetailSelect', // for same as listMind
    },

    LIST_SORT: {
        DEFAULT: 'time',
        TIME: 'time', // for view new task
        RANDOM: 'random', // for random view task
    },

    TASK_LIST_STATUS: {
        DEFAULT: 'hiden',
        HIDEN: 'hiden',
        SHOW_ALL: 'showAll',
        SHOW_GROUP: 'showGroup',
    }
}

// layout for summary code structure (meaning is no 2 Level depth. eg: Layout -> List -> Item -> otherComponent)
export default class TaskFollowUpLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            listSort: utils.getListSortStorage({ defaultValue: CONST.LIST_SORT.DEFAULT }), // for localStorage
            isShowPutOff: utils.getPutOffStorage({ defaultValue: false }) // for localStorage
        }

        this.showTaskWay = utils.getShowTaskWayStorage({ defaultValue: CONST.SHOW_TASK_WAY.DEFAULT }) // for persistence show task
        this.mindTargetGroupTaskRootId = utils.getMTGTRidStorage() // for recover show list target group todo task

        utils.initLayoutRef(this)
    }

    componentDidMount() {
        this.recoverShowTaskWay()
    }

    recoverShowTaskWay() { // for recover show task way
        const { showTaskWay, mindTargetGroupTaskRootId } = this

        switch (showTaskWay) {
            case CONST.SHOW_TASK_WAY.LIST_ALL:
                this.taskListRef.current.showAll()
                break;
            case CONST.SHOW_TASK_WAY.LIST_MIND:
                this.taskListRef.current.showGroup(mindTargetGroupTaskRootId)
                break;
            case CONST.SHOW_TASK_WAY.MIND_TARGET_SELECT:
                this.targetMindListSelectModalRef.current.show()
                break;
            case CONST.SHOW_TASK_WAY.MIND_DETAIL_SELECT:
                this.targetMindDetailSelectModalRef.current.show(mindTargetGroupTaskRootId)
                break;
            default:
                this.taskListRef.current.showAll()
        }
    }

    switchShowTaskWayHandle(showTaskWay, groupId) {
        utils.storageShowTaskWay({ showTaskWay, groupId, self: this })
        this.recoverShowTaskWay()
    }

    switchSortHandle() { }
    switchShowPutOffHandle() { }
    addHandle() { }
    editHandle() { }

    render() {
        const { listSort, isShowPutOff } = this.state
        const { taskListRef, taskDetailModalRef, targetMindListSelectModalRef, targetMindDetailSelectModalRef, tipModalRef, statisticsModalRef } = this

        return [
            <TaskList ref={taskListRef}
                switchShow={this.switchShowTaskWayHandle.bind(this)} // for switch show task way and localStorage
                sort={listSort} // for switch view task way
                switchSort={this.switchSortHandle.bind(this)} // for localStorage
                addHandle={this.addHandle.bind(this)} // for add task and show TaskDetailModal
                editHandle={this.editHandle.bind(this)} // for edit task and show TaskDetailModal
                // （Medium）
                isShowPutOff={isShowPutOff} // for switch view PutOff task
                switchShowPutOff={this.switchShowPutOffHandle.bind(this)} // for localStorage
                // （UnImportant）
                showTip={() => tipModalRef.current.show()}
                showStatistics={() => statisticsModalRef.current.show()}
            >{{ TaskListItem, PutOffButton }}</TaskList>,

            // Modal for persistence showTaskWay, prevent reload task list
            <TaskDetailModal ref={taskDetailModalRef} ></TaskDetailModal>,

            // for select target group task, 
            // Modal: not need prevent reload task list. but other funciton may need prevent reload. so need use Modal
            <TargetMindListSelectModal ref={targetMindListSelectModalRef}
                switchShow={this.switchShowTaskWayHandle.bind(this)} // for switch show task way and localStorage
                // （Medium）
                isShowPutOff={isShowPutOff} // for switch view PutOff task
                switchShowPutOff={this.switchShowPutOffHandle.bind(this)} // for localStorage
            >{{ TaskMindItem, PutOffButton }}</TargetMindListSelectModal>,

            // Modal: for persistence showTaskWay, prevent reload other funciton
            <TargetMindDetailSelectModal ref={targetMindDetailSelectModalRef}
                switchShow={this.switchShowTaskWayHandle.bind(this)} // for switch show task way and localStorage
                // （Medium）
                isShowPutOff={isShowPutOff} // for switch view PutOff task
                switchShowPutOff={this.switchShowPutOffHandle.bind(this)} // for localStorage
            >{{ TaskMindItem, PutOffButton }}</TargetMindDetailSelectModal>,

            // （UnImportant）for tip how to do
            <TipModal ref={tipModalRef} />,

            // （UnImportant）for view Completed tasks
            <StatisticsModal ref={statisticsModalRef} />
        ]
    }
}

class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.TASK_LIST_STATUS.DEFAULT, // for control page show, because hiden; show all; show group
            allTaskList: [], // for persistence all list, because have group list
            allTaskPageNo: 1,
            allTaskCount: 0,
            groupTaskList: [], // for all group list, no Pagination, just show all
        }
    }

    async showAll() {
        let { isInitAllTask, state = { isShow: 'showAll' } } = utils.getTaskListShowAllData(this)
        if (!isInitAllTask) {
            const fetchInstance = await fetch.get('allTaskList', { pageNo: 1 })
            if (fetchInstance.result !== 1) return reGetConfirm(fetchtInstance.message, this.showAll)
            state.allTaskList = fetchInstance.data.allTaskList
            state.allTaskCount = fetchInstance.data.allTaskCount
        }
        this.setState(state)
    }

    render() {
        const { isShow, pageStatus, allTaskList, groupTaskList } = this.state
        const { sort, switchSortHandle, isShowPutOff, switchShowPutOff, editHandle, addHandle } = this.props
        const { TaskListItem, PutOffButton } = this.props.children
        const taskListData = utils.getTaskRenderList({ pageStatus, allTaskList, groupTaskList, isShowPutOff })

        return <div className="task-list" style={utils.renderTaskListStyle(isShow)}>
            <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
            <div className="task-list-item">{taskListData.map((task, key) =>
                <TaskListItem key={key}
                    edit={editHandle}
                    data={task}
                />
            )}</div>
            <div className="task-list-operation">
                <div className="operation-sort" onClick={switchSortHandle}>{sort}</div>
                <div className="operation-add" onClick={addHandle}>add</div>
            </div>
        </div>
    }
}
const TaskListItem = () => <></>
const TaskDetailModal = () => <></>
const TargetMindListSelectModal = () => <></>
const TargetMindDetailSelectModal = () => <></>
const TaskMindItem = () => <></>
const TipModal = () => <></>
const StatisticsModal = () => <></>
const PutOffButton = () => <></>

const utils = {
    initLayoutRef: self => {
        self.taskListRef = React.createRef()
        self.taskDetailModalRef = React.createRef()
        self.targetMindListSelectModalRef = React.createRef()
        self.targetMindDetailSelectModalRef = React.createRef()
        self.tipModalRef = React.createRef()
        self.statisticsModalRef = React.createRef()
    },

    getShowTaskWayStorage: ({ defaultValue }) => { },
    getListSortStorage: ({ defaultValue }) => { },
    getMTGTRidStorage: () => { },
    storageShowTaskWay: ({ showTaskWay, groupId, self }) => { },
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
}
