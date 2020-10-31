import GlobalConst from './../const.js';
import OperationBarFixedBottom from './../../../components/operation-bar/fixed-bottom.jsx';

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

    async getTaskDetail() { }
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
            title: '',
            content: '',
            SMART: '', /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */

            putoff: null
        }

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
        const { pageStatus } = this.state

        return <Modal
            visible={pageStatus !== 'hiden'}
            isFullScreen={true}
        >
            <div className="task-detail-modal">
                <div className="task-detail-input">
                    <InputComponent></InputComponent>
                </div>

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

class InputComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <div className="detail-input-item">
        </div>
    }
}
