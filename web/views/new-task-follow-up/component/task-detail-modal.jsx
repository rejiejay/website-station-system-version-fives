import GlobalConst from './../const.js';
import OperationBarFixedBottom from './../../../components/operation-bar/fixed-bottom.jsx';
import MobileInput from './../../../components/mobile-input/index.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
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
        return true
    }

    async getTaskDetail(taskId) { }

    getSMARTdata() {
        const specific = ''
        const measurable = ''
        const attainable = ''
        const relevant = ''
        const timeBound = ''
        return { specific, measurable, attainable, relevant, timeBound }
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
        await this.getTaskDetail(taskId)
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
                    onChangeHandle={value => { }}
                    isRequiredHighlight
                    isAutoHeight={false}
                    height={250}
                    title='简单描述/提问/归纳'
                    placeholder='what情景? + what动作/冲突/方案'
                />
                <MobileInput key='content'
                    value={content}
                    onChangeHandle={value => { }}
                    isAutoHeight
                    height={250}
                    title='得出什么做法?'
                    placeholder='做法1: (情景是啥?)是什么?为什么?怎么办?'
                ></MobileInput>
                <MobileInput key='specific'
                    value={specific}
                    onChangeHandle={value => { }}
                    isAutoHeight
                    height={125}
                    title='任务具体内容?'
                    placeholder='任务是什么?为什么存在这个任务?有啥影响?'
                ></MobileInput>
                <MobileInput key='measurable'
                    value={measurable}
                    onChangeHandle={value => { }}
                    isAutoHeight
                    height={125}
                    title='任务完成标识?'
                    placeholder='完成的标识是什么?为什么就标志任务完成?'
                ></MobileInput>
                <MobileInput key='attainable'
                    value={attainable}
                    onChangeHandle={value => { }}
                    isAutoHeight
                    height={125}
                    title='任务是否可以实现?'
                    placeholder='为什么可以实现?为什么未来的自己所接受呢? 原因?'
                ></MobileInput>
                <MobileInput key='relevant'
                    value={relevant}
                    onChangeHandle={value => { }}
                    isAutoHeight
                    height={125}
                    title='任务和哪些需求相关?'
                    placeholder='physiological safety belongingness and love respect self-actualization needs、为什么和这个需求相关? 需求1?为什么?'
                ></MobileInput>
                <MobileInput key='timeBound'
                    value={timeBound}
                    onChangeHandle={value => { }}
                    isAutoHeight
                    height={125}
                    title='明确的截止期限?'
                    placeholder='期限1： 是什么?为什么设定这个时间?'
                >{{
                    rightTopDiv: <div className='select-putoff'
                        onClick={() => { }}
                    >{putoff ? putoff : '选择期限'}</div>
                }}</MobileInput>

                <OperationBarFixedBottom
                    leftButtonArray={[
                        {
                            key: 'cancel',
                            description: 'cancel',
                            fun: () => { }
                        }
                    ].filter(this.buttonFilter.bind(this))}
                    rightButtonArray={[
                        {
                            key: 'add',
                            description: 'add',
                            fun: () => { }
                        }, {
                            key: 'delete',
                            description: 'delete',
                            fun: () => { }
                        }, {
                            key: 'edit',
                            description: 'edit',
                            fun: () => { }
                        }, {
                            key: 'complete',
                            description: 'complete',
                            fun: () => { }
                        }
                    ].filter(this.buttonFilter.bind(this))}
                />
            </div>
        </Modal>
    }
}
