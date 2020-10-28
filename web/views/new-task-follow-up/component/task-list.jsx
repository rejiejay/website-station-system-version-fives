import Server from './../server.js';
import CONST from './../const.js';
import OperationBarFixedBottom from './../../../components/operation-bar/fixed-bottom.jsx';
import ListOperation from './list-operation.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
    }

    switchItemSize() {
        const { isBigItem } = this.state
        this.setState({ isBigItem: !isBigItem })
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
}

export default class TaskListLayout extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            isBigItem: true,
            /**
             * all time group
             */
            pageStatus: CONST.TASK_LIST_STATUS.DEFAULT,

            allTaskList: CONST.TASK_LIST.DEFAULT, // for persistence all list, because have group list

            randomTaskList: CONST.TASK_LIST.DEFAULT
        }

        this.allTaskPageNo = 1
        this.allTaskCount = 0
    }

    render() {
        const { allTaskCount } = this
        const { pageStatus, allTaskList, isBigItem } = this.state
        const {
            timeCategoryTaskList, groupCategoryTaskList,
            sort, switchSortHandle, editHandle, addHandle, switchShow
        } = this.props

        return <div className="task-list">

            <div className="task-top-operation flex-center"
                onClick={this.switchItemSize.bind(this)}
            >{isBigItem ? '切换小列表' : '返回大列表'}</div>

            <TaskList className='task-list-all' key='list-all'
                isBigItem={isBigItem}
                isShowStyle={utils.isShowLllTaskList(pageStatus)}
                listData={allTaskList}
            >{{
                TaskListItem,
                ShowMore: <div className="list-show-more">{allTaskCount - allTaskList.length}</div>
            }}</TaskList>

            <OperationBarFixedBottom
                leftButtonArray={[
                    {
                        description: '任务列表',
                        fun: () => { }
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

export class TaskList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { className, isShowStyle, listData, editHandle } = this.props
        const { ShowMore } = this.props.children

        return <div className={className} style={isShowStyle}>
            {listData.map((task, key) =>
                <TaskListItem key={key}
                    edit={editHandle}
                    data={task}
                />
            )}
            {ShowMore}
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
    isShowLllTaskList: pageStatus => ({}),

    getTaskRenderList: function getTaskRenderList({ pageStatus, allTaskList, groupTaskList, isShowPutOff }) {
        if (pageStatus === 'showGroup') return groupTaskList
        return allTaskList
    },

    getTaskListLeftOperation: function getTaskListLeftOperation(pageStatus, leftButtonFun) {
        if (pageStatus === 'showGroup') return leftButtonFun
        return false
    }
}
