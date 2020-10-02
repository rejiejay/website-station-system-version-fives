import CONST from './../const.js';
import utils from './../utils.js';

// For UI Dev && Will Del
const fakeDataTaskList = [
    {
        id: 1,
        parentid: 'root',
        rootid: '12312',
        title: 'biapoti',
        content: 'neir onhg',
        SMART: '', /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */
        timestamp: 1590495644334,
        putoff: 1590495644334,
    },
    { id: 2, parentid: 'root', rootid: '12312', title: '12312312321', content: 'ne123123123ir onhg', SMART: '', timestamp: 1590495644334, putoff: 1590495644334 },
    { id: 1123, parentid: 'root', rootid: 'fasfasf ', title: '123asdasd12312321', content: 'ne123123123ir onhg', SMART: '', timestamp: 1590495644334, putoff: 1590495644334 },
    { id: 3, parentid: 'root', rootid: '123adas', title: 'dasdasdasdasd', content: 'ne123123123ir onhg', SMART: '', timestamp: 1590495644334, putoff: 1590495644334 },
]

export default class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.TASK_LIST_STATUS.DEFAULT, // for control page show, because hiden; show all; show group
            allTaskList: fakeDataTaskList, // for persistence all list, because have group list
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
                    { name: '导图', fun: () => switchShow({ showTaskWay: 'listMind' }) },
                    { name: sort, fun: switchSortHandle },
                    { name: '新增', fun: addHandle }
                ]}
            />
        </div>
    }
}
