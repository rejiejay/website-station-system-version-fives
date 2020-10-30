import Modal from './../../components/modal/index.jsx';
import consequencer from './../../utils/consequencer.js'
import uiStorage from './../../components/ui-storage/index';

import TaskList, { TaskListItem } from './component/task-list.jsx';
import PutOffButton from './component/put-off-button.jsx';
import TaskDetailModal from './component/task-detail-modal.jsx';
import TargetMindListSelectModal from './component/target-mind-list-select-modal.jsx';
import TaskMindItem from './component/task-mind-item.jsx';
import TargetMindDetailSelectModal from './component/target-mind-detail-select-modal.jsx';
import TipModal from './component/tip-modal.jsx';
import StatisticsModal from './component/statistics-modal.jsx';
import ListOperation from './component/list-operation.jsx';

import CONST from './const.js';
import Server from './server.js';
import utils from './utils.js';

class Utils extends React.Component {
    constructor(props) {
        super(props)
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

    switchShowTaskWayHandle({ showTaskWay, groupId }) {
        this.showTaskWay = showTaskWay
        this.mindTargetGroupTaskRootId = groupId
        uiStorage.setShowTaskWay({ showTaskWay, groupId })
        this.recoverShowTaskWay()
    }

    switchSortHandle() { }
    switchShowPutOffHandle() { }

    /**
     * For just add mind depth 1
     * @param {object} reGetTask for server error handle reget
     * @param {number} taskParentId For add mind depth
     */
    async addHandle({ groupCategory, timeCategory }) {
        const { showTaskWay, mindTargetGroupTaskRootId } = this

        /**
         * not handle error, because it must need successs, otherwise need reget handle
         * for persistence, because today just need get one time
         */
        const todayGroupTaskRootId = await utils.getTodayGroupTaskRootId()

        if (!reGetTask) {
            this.newTaskInstance = await this.taskDetailModalRef.current.showAdd()
            if (this.newTaskInstance.result !== 1) return
        }
        const task = reGetTask ? reGetTask : this.newTaskInstance.data

        if (!taskParentId) {
            const groupTaskRootId = this.isAddTaskToday(showTaskWay) ? todayGroupTaskRootId : mindTargetGroupTaskRootId
            taskParentId = groupTaskRootId
        }

        const fetchInstance = await Server.addTask({ task, taskParentId })
        // if (fetchInstance.result !== 1) return reGetConfirm(fetchtInstance.message, () => this.addHandle(task))
    }

    async editHandle({ task }) {
        const { changeNodeResolve } = this
        if (changeNodeResolve) {
            const fetchInstance = await Server.changeTaskNode({ taskId: this.changeNodeTaskId, taskParentId: task.id })
            // if (fetchInstance.result !== 1) return reGetConfirm(fetchtInstance.message, () => this.editHandle({ task }))
            changeNodeResolve(consequencer.success())
            this.changeNodeResolve = null
            this.changeNodeTaskId = null
            return
        }
        this.editTaskInstance = await this.taskDetailModalRef.current.showEdit({ task })
    }

    changeNodeHandle(taskId) {
        const self = this
        this.recoverShowTaskWay()
        this.changeNodeTaskId = taskId
        return new Promise(resolve => self.changeNodeResolve = resolve)
    }

    initLayoutRef() {
        this.taskListRef = React.createRef()
        this.taskDetailModalRef = React.createRef()
        this.targetMindListSelectModalRef = React.createRef()
        this.targetMindDetailSelectModalRef = React.createRef()
        this.tipModalRef = React.createRef()
        this.statisticsModalRef = React.createRef()
    }

    getListSortStorage({ defaultValue }) {
        const sort = uiStorage.getTaskListSort()
        if (sort) return sort
        return defaultValue
    }

    getPutOffStorage() { }

    getShowTaskWayStorage({ defaultValue }) {
        const showTaskWay = uiStorage.getShowTaskWay()
        if (showTaskWay) return showTaskWay
        return defaultValue
    }

    getMTGTRidStorage() {
        const mindTargetGroupTaskRootId = uiStorage.getMTGTRid()
        if (mindTargetGroupTaskRootId) return mindTargetGroupTaskRootId
        return null
    }

    isAddTaskToday(showTaskWay) { }
}

// layout for summary code structure (meaning is no 2 Level depth. eg: Layout -> List -> Item -> otherComponent)
export default class TaskFollowUpLayout extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            listSort: this.getListSortStorage({ defaultValue: CONST.LIST_SORT.DEFAULT }), // for localStorage
            isShowPutOff: this.getPutOffStorage({ defaultValue: false }), // for localStorage
        }

        this.showTaskWay = this.getShowTaskWayStorage({ defaultValue: CONST.SHOW_TASK_WAY.DEFAULT }) // for persistence show task
        this.mindTargetGroupTaskRootId = this.getMTGTRidStorage() // for recover show list target group todo task

        this.changeNodeResolve = null
        this.changeNodeTaskId = null

        this.initLayoutRef()
    }

    componentDidMount() {
        this.recoverShowTaskWay()
    }

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
            >{{ TaskListItem, PutOffButton, ListOperation }}</TaskList>,

            // Modal for persistence showTaskWay, prevent reload task list
            <TaskDetailModal ref={taskDetailModalRef}
                changeNodeHandle={this.changeNodeHandle.bind(this)}
            >{{ Modal, ListOperation }}</TaskDetailModal>,

            // for select target group task, 
            // Modal: not need prevent reload task list. but other funciton may need prevent reload. so need use Modal
            <TargetMindListSelectModal ref={targetMindListSelectModalRef}
                switchShow={this.switchShowTaskWayHandle.bind(this)} // for switch show task way and localStorage
                addHandle={this.addHandle.bind(this)}
                // （Medium）
                isShowPutOff={isShowPutOff} // for switch view PutOff task
                switchShowPutOff={this.switchShowPutOffHandle.bind(this)} // for localStorage
            >{{ Modal, TaskMindItem, PutOffButton, ListOperation }}</TargetMindListSelectModal>,

            // Modal: for persistence showTaskWay, prevent reload other funciton
            <TargetMindDetailSelectModal ref={targetMindDetailSelectModalRef}
                switchShow={this.switchShowTaskWayHandle.bind(this)} // for switch show task way and localStorage
                addHandle={this.addHandle.bind(this)}
                // （Medium）
                isShowPutOff={isShowPutOff} // for switch view PutOff task
                switchShowPutOff={this.switchShowPutOffHandle.bind(this)} // for localStorage
            >{{ Modal, TaskMindItem, PutOffButton, ListOperation }}</TargetMindDetailSelectModal>,

            // （UnImportant）for tip how to do
            <TipModal ref={tipModalRef} >{{ Modal }}</TipModal>,

            // （UnImportant）for view Completed tasks
            <StatisticsModal ref={statisticsModalRef} >{{ Modal }}</StatisticsModal>
        ]
    }
}

window.onload = () => ReactDOM.render(<TaskFollowUpLayout />, document.body)
