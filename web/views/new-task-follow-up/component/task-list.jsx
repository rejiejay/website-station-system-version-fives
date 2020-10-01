import CONST from './../const.js';
import utils from './../utils.js';

export default class TaskList extends React.Component {
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
            // const fetchInstance = await fetch.get('allTaskList', { pageNo: 1 })
            // if (fetchInstance.result !== 1) return reGetConfirm(fetchtInstance.message, this.showAll)
            // state.allTaskList = fetchInstance.data.allTaskList
            // state.allTaskCount = fetchInstance.data.allTaskCount
        }
        this.setState(state)
    }

    async showGroup(groupTaskRootId) { }

    render() {
        const { isShow, pageStatus, allTaskList, groupTaskList } = this.state
        const { sort, switchSortHandle, isShowPutOff, switchShowPutOff, editHandle, addHandle, switchShow } = this.props
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
                <div className="operation-mind" onClick={switchShow}>思维导图</div>
                <div className="operation-sort" onClick={switchSortHandle}>{sort}</div>
                <div className="operation-add" onClick={addHandle}>add</div>
            </div>
        </div>
    }
}
