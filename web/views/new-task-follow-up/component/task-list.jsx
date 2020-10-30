import Server from './../server.js';
import OperationBarFixedBottom from './../../../components/operation-bar/fixed-bottom.jsx';
import ListOperation from './list-operation.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
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

    createListItemContainerStyle() {
        const { isBigItem } = this.props
        const { clientHeight } = this

        if (isBigItem) return {
            minHeight: `${clientHeight - 125}px`
        }

        return {
            height: '45px',
            borderBottom: 'none',
            paddingBottom: '0px'
        }
    }

    createShowLllTaskListStyle() {
        const { pageStatus } = this.state

        if (pageStatus === 'all') return { display: 'block' }
        return { display: 'none' }
    }

    async addHandle() {
        const { pageStatus } = this.state
        const { groupCategory, timeCategory } = this
        const addCallBackHandle = this.props.addHandle
        const parameter = { groupCategory: 'uncategorized', timeCategory: 'today' }

        if (pageStatus === 'group') parameter.groupCategory = groupCategory
        if (pageStatus === 'time') parameter.timeCategory = timeCategory
        
        const fetchInstance = await addCallBackHandle(parameter)

        /**
         * Handle fetchInstance
         */
    }
}

const CONST = {
    page_status: {
        default: 'all',
        all: 'all',
        time: 'time',
        group: 'group',
        hiden: 'hiden'
    },

    task_list: {
        default: []
    }
}

export default class TaskListLayout extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            isBigItem: true,

            pageStatus: CONST.page_status.default,

            allTaskList: CONST.task_list.default, // for persistence all list, because have group list

            randomTaskList: CONST.task_list.default
        }

        this.allTaskPageNo = 1
        this.allTaskCount = 0
        this.timeCategory = 'today'
        this.groupCategory = 'uncategorized'
    }

    render() {
        const { allTaskCount } = this
        const { allTaskList, isBigItem } = this.state
        const {
            timeCategoryTaskList, groupCategoryTaskList,
            sort, switchSortHandle, switchShow
        } = this.props

        return <div className="task-list">

            <div className="task-top-operation flex-center"
                onClick={this.switchItemSize.bind(this)}
            >{isBigItem ? '切换小列表' : '返回大列表'}</div>

            <TaskList className='task-list-all' key='list-all'
                isBigItem={isBigItem}
                isShowStyle={this.createShowLllTaskListStyle.call(this)}
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
                        fun: this.addHandle.bind(this)
                    }
                ]}
            />
        </div>
    }
}

export class TaskList extends Utils {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { className, isShowStyle, listData, editHandle, isBigItem } = this.props
        const { ShowMore } = this.props.children

        return <div className={className} style={isShowStyle}>
            {listData.map((task, key) =>
                <TaskListItem key={key}
                    isBigItem={isBigItem}
                    edit={editHandle}
                    data={task}
                />
            )}
            {ShowMore}
        </div>
    }
}

export class TaskListItem extends Utils {
    constructor(props) {
        super(props)
    }

    render() {
        const { data } = this.props
        const { isBigItem } = this.props

        return <ListItemContainer
            style={this.createListItemContainerStyle.call(this)}
            isBigItem={isBigItem}
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

const ListItemContainer = ({ style, isBigItem, title, children }) => <div className="task-list-item list-item">
    <div className="task-item-container" style={style}>
        <div className="list-item-title">{title}</div>
        {isBigItem && children}
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
