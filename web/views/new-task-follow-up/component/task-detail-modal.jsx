import CONST from './../const.js';
import utils from './../utils.js';

export default class TaskDetailModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.TASK_DETAIL_STATUS.DEFAULT,
            task: CONST.TASK.DEFAULT
        }
    }

    showAdd() {
        this.setState({ pageStatus: 'add' })
    }

    async showEdit(taskId) {
        this.setState({ pageStatus: 'edit' })
        await this.getTaskDetail(taskId)
    }

    // Not handle Error, It must success
    async getTaskDetail(taskId) { }

    async changeNodeHandle() {
        const { changeNodeHandle } = this.props
        const { task } = this.state
        this.setState({ pageStatus: 'hiden' })
        const changeInstance = await changeNodeHandle(task.id)
        this.setState({ pageStatus: 'edit' })
        if (changeInstance.result !== 1) return alert(changeInstance.message)
        await this.getTaskDetail(taskId)
    }

    render() {
        const { pageStatus } = this.state
        const { Modal, ListOperation } = this.props.children

        return <Modal
            visible
            maskClosable={false}
        >
            <div className="task-detail-modal">
                <div className="task-detail-input">
                    <InputComponent></InputComponent>
                </div>
                <ListOperation
                    rightOperation={[
                        { scope: 'edit', name: '推迟', fun: () => { } },
                        { scope: 'edit', name: '删除', fun: () => { } },
                        { scope: 'edit', name: '置顶Top', fun: () => { } },
                        { scope: 'add', name: '完成', fun: () => { } },
                        { scope: 'edit', name: '移动', fun: this.changeNodeHandle.bind(this) },
                        { scope: 'edit', name: '暂存', fun: () => { } },
                        { scope: 'edit', name: '新增子节点', fun: () => { } },
                        { scope: 'edit|add', name: '取消', fun: () => { } },
                    ].filter(({ scope }) => scope.includes(pageStatus))}
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
