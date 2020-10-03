import Server from './../server.js';
import CONST from './../const.js';
import utils from './../utils.js';

export default class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.TASK_LIST_STATUS.DEFAULT, // for control page show, because hiden; show all; show group
            allTaskList: CONST.TASK_LIST.DEFAULT, // for persistence all list, because have group list
            allTaskPageNo: 1,
            allTaskCount: 0,
            groupTaskList: CONST.TASK_LIST.DEFAULT, // for all group list, no Pagination, just show all
        }
    }

    async showAll() {
        const { allTaskList } = this.state
        if (allTaskList.length <= 0) {
            const allTaskList = await Server.getAllTaskList({ pageNo: 1 }) // Not handle Error. it must sucessful
            const allTaskCount = await Server.getAllTaskCount() // Not handle Error. it must sucessful
            return this.setState({ allTaskList, allTaskCount, isShow: 'showAll' })
        }
        this.setState({ isShow: 'showAll' })
    }

    async showGroup(groupTaskRootId) { }

    render() {
        const { isShow, pageStatus, allTaskList, groupTaskList } = this.state
        const { sort, switchSortHandle, isShowPutOff, switchShowPutOff, editHandle, addHandle, switchShow } = this.props
        const { TaskListItem, PutOffButton, ListOperation } = this.props.children
        const taskListData = utils.getTaskRenderList({ pageStatus, allTaskList, groupTaskList, isShowPutOff })

        return <div className="task-list" style={utils.renderTaskListStyle(isShow)}>
            <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
            {taskListData.map((task, key) =>
                <TaskListItem key={key}
                    edit={editHandle}
                    data={task}
                >{{ ListOperation }}</TaskListItem>
            )}
            <ListOperation
                leftButtonFun={utils.getTaskListLeftOperation(pageStatus, () => switchShow({ showTaskWay: 'listAll' }))}
                leftButtonDes={pageStatus === 'showGroup' && '任务列表'}
                rightOperation={[
                    { name: '导图', fun: () => switchShow({ showTaskWay: 'mindTargetSelect' }) },
                    { name: sort, fun: switchSortHandle },
                    { name: '新增', fun: addHandle }
                ]}
            />
        </div>
    }
}
