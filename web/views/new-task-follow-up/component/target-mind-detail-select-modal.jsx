import Server from './../server.js';

export default class TargetMindDetailSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            mind: null
        }

        this.groupTaskRootId = null
    }

    async show(groupTaskRootId) {
        this.groupTaskRootId = groupTaskRootId
        this.setState({ visible: true })
        await this.initTaskMind()
    }

    async initTaskMind() {
        const fetchInstance = await Server.getTaskMind({ groupTaskRootId: this.groupTaskRootId })
        // if (fetchInstance.result !== 1) return reGetConfirm(fetchtInstance.message, () => this.initTaskMind())
        // const mind = fetchInstance.data
        // this.setState({ mind })
    }

    async editTaskHandle(taskId) {
        const { editHandle } = this.props
        const eidtInstance = await editHandle(taskId) // it must success, because there are no handle error
        if (eidtInstance.result === 1) return this.initTaskMind()
        if (eidtInstance.result === 2) return addTaskHandle(taskId) // it for add deep 2
        // other result is cancel
    }

    async addTaskHandle(taskId) {
        const { addHandle } = this.props
        const addInstance = await addHandle(taskId)
        if (addInstance.result === 1) return this.initTaskMind()
        // other result is cancel
    }

    render() {
        const { mind, visible } = this.state
        const { switchShow, isShowPutOff, switchShowPutOff } = this.props
        const { Modal, PutOffButton, TaskMindItem, ListOperation } = this.props.children

        return <Modal
            visible={visible}
            maskClosable={false}
        >
            <div className="target-mind-list-select-modal">
                <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
                <div className="task-mind-item">
                    <TaskMindItem
                        edit={this.editTaskHandle.bind(this)}
                        data={mind}
                    />
                </div>
                <ListOperation
                    leftButtonFun={() => switchShow({ showTaskWay: 'listMind' })}
                    leftButtonDes={'思维列表'}
                    rightOperation={[
                        { name: '任务列表', fun: () => switchShow({ showTaskWay: 'listAll' }) },
                        { name: 'add', fun: () => this.addTaskHandle.call(this) }
                    ]}
                />
            </div>
        </Modal>
    }
}
