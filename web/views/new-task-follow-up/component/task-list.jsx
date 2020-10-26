import Server from './../server.js';
import CONST from './../const.js';
import OperationBarFixedBottom from './../../../components/operation-bar/fixed-bottom.jsx';

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
            <OperationBarFixedBottom
                leftButtonArray={[
                    {
                        description: '任务列表',
                        fun: utils.getTaskListLeftOperation(pageStatus, () => switchShow({ showTaskWay: 'listAll' }))
                    }
                ]}
                rightButtonArray={[
                    {
                        description: '导图',
                        fun: () => switchShow({ showTaskWay: 'mindTargetSelect' })
                    }, {
                        description: sort,
                        fun: switchSortHandle
                    }, {
                        description: '新增',
                        fun: addHandle
                    }
                ]}
            />
        </div>
    }
}

export class TaskListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
    }

    render() {
        const { data } = this.props
        const { ListOperation } = this.props.children
        const { clientHeight } = this
        const style = { minHeight: `${clientHeight - 125}px` }

        return <ListItemContainer
            style={style}
            title={data.title}
        >
            <ListItemContent key="content" text={data.content} />
            <ListOperation
                isAbsolute
                rightOperation={[
                    { name: '编辑', fun: () => { } }
                ]}
            />
        </ListItemContainer>
    }
}

const ListItemContainer = ({ style, title, children }) => <div className="task-list-item list-item">
    <div className="task-item-container" style={style}>
        <div className="list-item-title">{title}</div>
        {children}
    </div>
</div>

const ListItemContent = ({ text }) => <div className="list-item-content" dangerouslySetInnerHTML={{ __html: !!text && typeof text === 'string' ? text.replace(/\n/g, "<br>") : '' }}></div>

const utils = {
    getTaskRenderList: function getTaskRenderList({ pageStatus, allTaskList, groupTaskList, isShowPutOff }) {
        if (pageStatus === 'showGroup') return groupTaskList
        return allTaskList
    },

    renderTaskListStyle: isShow => ({ display: isShow ? 'block' : 'none' }),

    getTaskListLeftOperation: function getTaskListLeftOperation(pageStatus, leftButtonFun) {
        if (pageStatus === 'showGroup') return leftButtonFun
        return false
    }
}
