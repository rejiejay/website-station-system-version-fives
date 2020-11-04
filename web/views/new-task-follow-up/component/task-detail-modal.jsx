import GlobalConst from './../const.js';
import OperationBarFixedBottom from './../../../components/operation-bar/fixed-bottom.jsx';
import MobileInput from './../../../components/mobile-input/index.jsx';
import TemporaryStorage from './../../../utils/temporary-storage.jsx';
import jsonHandle from './../../../utils/json-handle.js';

class Utils extends React.Component {
    constructor(props) {
        super(props)

        this.nowTimestamp = new TemporaryStorage(() => new Date().getTime())
    }

    buttonFilter(button) {
        const { pageStatus } = this.state
        let isNeed = false

        if (button.key === 'cancel') isNeed = true
        if (button.key === 'add' && pageStatus === 'add') isNeed = true
        if (['delete', 'complete'].includes(button.key) && pageStatus === 'edit') isNeed = true
        if (button.key === 'edit' && pageStatus === 'edit' && this.verifyEditDiff()) isNeed = true

        return isNeed
    }

    verifyEditDiff() {
        const { originalTask } = this

        const { title, content, SMART, putoff } = this.state

        let isDiff = false
        if (originalTask && title !== originalTask.title) isDiff = true
        if (originalTask && content !== originalTask.content) isDiff = true
        if (originalTask && SMART !== originalTask.SMART) isDiff = true
        if (originalTask && putoff !== originalTask.putoff) isDiff = true
        return isDiff
    }

    async initTaskDetail(taskId) { }

    getSMARTdata() {
        const { SMART } = this.state
        if (SMART === '') return { specific: '', measurable: '', attainable: '', relevant: '', timeBound: '' }

        const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: SMART })
        if (!verifyJSONresult.isCorrect) return { specific: '', measurable: '', attainable: '', relevant: '', timeBound: '' }

        const { specific, measurable, attainable, relevant, timeBound } = verifyJSONresult.data
        return { specific, measurable, attainable, relevant, timeBound }
    }

    setSMARTdata(value, key) {
        const SMART = this.getSMARTdata()
        SMART[key] = value
        this.setState({ SMART: JSON.stringify(SMART) })
    }

    dayTimestamp = 1000 * 60 * 60 * 24

    putoffSelectHandle() {
        const self = this
        const nowTimestamp = this.nowTimestamp.get()
        const handle = ({ value, label }) => self.setState({ putoff: value })

        actionSheetPopUp({
            title: '请选择推迟日期',
            options: [
                { label: 'year', value: nowTimestamp + (this.dayTimestamp * 361) },
                { label: 'month', value: nowTimestamp + (this.dayTimestamp * 31) },
                { label: 'week', value: nowTimestamp + (this.dayTimestamp * 7) },
                { label: 'recently', value: nowTimestamp + (this.dayTimestamp * 3) },
                { label: 'today', value: nowTimestamp },
            ],
            handle
        })
    }

    putoffToDes() {
        const { putoff } = this.state
        const nowTimestamp = this.nowTimestamp.get()
        if (putoff < (nowTimestamp + this.dayTimestamp)) return 'today'
        if (putoff > (nowTimestamp + this.dayTimestamp) && putoff < (nowTimestamp + (this.dayTimestamp * 4))) return 'recently'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 4)) && putoff < (nowTimestamp + (this.dayTimestamp * 8))) return 'week'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 8)) && putoff < (nowTimestamp + (this.dayTimestamp * 31))) return 'month'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 31)) && putoff < (nowTimestamp + (this.dayTimestamp * 361))) return 'year'
        if (putoff > (nowTimestamp + (this.dayTimestamp * 361))) return 'more that year'

        return 'today'
    }

    confirmHandle = msg => new Promise(resolve => {
        confirmPopUp({
            title: msg
        })
            .then(() => resolve(consequencer.success()))
            .catch(reason => resolve(consequencer.error(reason)))
    })

    async cancelHandle() {
        const confirmInstance = await this.confirmHandle('cancel confirm')
        if (confirmInstance.result === 1) this.taskResolvedHandle(confirmInstance)
    }

    getSubmitTaskData() {
        if (!title) return consequencer.error('title can`t null')
        if (!content) return consequencer.error('content can`t null')

        const { title, content, SMART, putoff } = this.state

        return { title, content, SMART, putoff }
    }

    async addHandle() {
        const confirmInstance = await this.confirmHandle('add confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const taskInstance = this.getSubmitTaskData()
        if (taskInstance.result !== 1) return await this.confirmHandle(taskInstance.message)

        const task = taskInstance.data
        const fetchInstance = await server.addTask(task)
        this.taskResolvedHandle(fetchInstance)
    }

    async deleteHandle() {
        const confirmInstance = await this.confirmHandle('delete confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const fetchInstance = await server.deleteTask(originalTask.id)
        this.taskResolvedHandle(fetchInstance)
    }

    async editHandle() {
        const confirmInstance = await this.confirmHandle('edit confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const taskInstance = this.getSubmitTaskData()
        if (taskInstance.result !== 1) return await this.confirmHandle(taskInstance.message)

        const task = taskInstance.data
        const fetchInstance = await server.editTask(originalTask.id, task)
        this.taskResolvedHandle(fetchInstance)
    }

    async completeHandle() {
        const confirmInstance = await this.confirmHandle('complete confirm')
        if (confirmInstance.result !== 1) return this.taskResolvedHandle(confirmInstance)

        const fetchInstance = await server.completeTask(originalTask.id)
        this.taskResolvedHandle(fetchInstance)
    }
}

const CONST = {
    page_status: {
        default: 'hiden',
        add: 'add',
        edit: 'edit',
        hiden: 'hiden'
    }
}

export default class TaskDetailModal extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.page_status.default,
            task: GlobalConst.TASK.DEFAULT,

            title: '',
            content: '',
            SMART: '', /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */

            putoff: null,
        }

        this.nodeid = null // create timestamp
        this.parentid = null
        this.originalTask = GlobalConst.TASK.DEFAULT // for Edit
        this.taskResolvedHandle = () => { }
    }

    showAdd({ putoff, parentId }) {
        const self = this
        this.setState({ pageStatus: 'add' })

        return new Promise(resolve => self.taskResolvedHandle = resolve)
    }

    async showEdit(taskId) {
        this.setState({ pageStatus: 'edit' })
        await this.initTaskDetail(taskId)
        return new Promise(resolve => self.taskResolvedHandle = resolve)
    }

    render() {
        const { Modal } = this.props.children
        const { pageStatus, title, content, SMART, putoff } = this.state
        const { specific, measurable, attainable, relevant, timeBound } = this.getSMARTdata({ SMART })

        return <Modal
            visible={pageStatus !== 'hiden'}
            isFullScreen={true}
        >
            <div className="task-detail-modal">
                <MobileInput key='title'
                    value={title}
                    onChangeHandle={value => this.setState({ title: value })}
                    isTheme
                    isRequiredHighlight
                    title='简单描述/提问/归纳'
                    placeholder='what情景? + what动作/冲突/方案'
                />
                <MobileInput key='content'
                    value={content}
                    onChangeHandle={value => this.setState({ content: value })}
                    isAutoHeight
                    height={250}
                    title='得出什么做法?'
                    placeholder='做法1: (情景是啥?)是什么?为什么?怎么办?'
                ></MobileInput>
                <MobileInput key='specific'
                    value={specific}
                    onChangeHandle={value => this.setSMARTdata(value, 'specific')}
                    isAutoHeight
                    height={125}
                    title='任务具体内容?'
                    placeholder='任务是什么?为什么存在这个任务?有啥影响?'
                ></MobileInput>
                <MobileInput key='measurable'
                    value={measurable}
                    onChangeHandle={value => this.setSMARTdata(value, 'measurable')}
                    isAutoHeight
                    height={125}
                    title='任务完成标识?'
                    placeholder='完成的标识是什么?为什么就标志任务完成?'
                ></MobileInput>
                <MobileInput key='attainable'
                    value={attainable}
                    onChangeHandle={value => this.setSMARTdata(value, 'attainable')}
                    isAutoHeight
                    height={125}
                    title='任务是否可以实现?'
                    placeholder='为什么可以实现?为什么未来的自己所接受呢? 原因?'
                ></MobileInput>
                <MobileInput key='relevant'
                    value={relevant}
                    onChangeHandle={value => this.setSMARTdata(value, 'relevant')}
                    isAutoHeight
                    height={125}
                    title='任务和哪些需求相关?'
                    placeholder='physiological safety belongingness and love respect self-actualization needs、为什么和这个需求相关? 需求1?为什么?'
                ></MobileInput>
                <MobileInput key='timeBound'
                    value={timeBound}
                    onChangeHandle={value => this.setSMARTdata(value, 'timeBound')}
                    isAutoHeight
                    height={125}
                    title='明确的截止期限?'
                    placeholder='期限1： 是什么?为什么设定这个时间?'
                >{{
                    rightTopDiv: <div className='select-putoff'
                        onClick={this.putoffSelectHandle.bind(this)}
                    >{putoff ? this.putoffToDes.call(this) : '选择期限'}</div>
                }}</MobileInput>

                <OperationBarFixedBottom
                    leftButtonArray={[
                        {
                            key: 'cancel',
                            description: 'cancel',
                            fun: this.cancelHandle.bind(this)
                        }
                    ].filter(this.buttonFilter.bind(this))}
                    rightButtonArray={[
                        {
                            key: 'add',
                            description: 'add',
                            fun: this.addHandle.bind(this)
                        }, {
                            key: 'delete',
                            description: 'delete',
                            fun: this.deleteHandle.bind(this)
                        }, {
                            key: 'edit',
                            description: 'edit',
                            fun: this.editHandle.bind(this)
                        }, {
                            key: 'complete',
                            description: 'complete',
                            fun: this.completeHandle.bind(this)
                        }
                    ].filter(this.buttonFilter.bind(this))}
                />
            </div>
        </Modal>
    }
}
