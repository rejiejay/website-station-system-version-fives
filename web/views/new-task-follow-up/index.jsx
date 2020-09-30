import TaskList from './component/task-list.jsx';
import TaskListItem from './component/task-list-item.jsx';
import PutOffButton from './component/put-off-button.jsx';
import TaskDetailModal from './component/task-detail-modal.jsx';
import TargetMindListSelectModal from './component/target-mind-list-select-modal.jsx';
import TaskMindItem from './component/task-mind-item.jsx';
import TargetMindDetailSelectModal from './component/target-mind-detail-select-modal.jsx';
import TipModal from './component/tip-modal.jsx';
import StatisticsModal from './component/statistics-modal.jsx';

import CONST from './const.js';
import utils from './utils.js';

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

window.onload = () => ReactDOM.render(<TaskFollowUpLayout />, document.body)