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
        const { TaskListItem, PutOffButton, ListOperation } = this.props.children
        const taskListData = utils.getTaskRenderList({ pageStatus, allTaskList, groupTaskList, isShowPutOff })

        return <div className="task-list" style={utils.renderTaskListStyle(isShow)}>
            <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
            <div className="task-list-item">{taskListData.map((task, key) =>
                <TaskListItem key={key}
                    edit={editHandle}
                    data={task}
                />
            )}</div>
            <ListOperation
                leftButtonFun={() => switchShow({ showTaskWay: 'listAll' })}
                leftButtonDes={pageStatus === 'showGroup' && '任务列表'}
                rightOperation={[
                    { name: '思维导图', fun: () => switchShow({ showTaskWay: 'listMind' }) },
                    { name: sort, fun: switchSortHandle },
                    { name: 'add', fun: addHandle }
                ]}
            />
        </div>
    }
}
