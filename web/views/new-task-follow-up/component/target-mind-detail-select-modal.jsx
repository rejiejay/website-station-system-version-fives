export default class TargetMindDetailSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    async show() { }

    render() {
        const { taskMindListData } = this.state
        const { editHandle, addHandle, switchShow, isShowPutOff, switchShowPutOff } = this.props
        const { Modal, PutOffButton, TaskMindItem } = this.props.children

        return <Modal
            visible
            maskClosable={false}
        >
            <div className="target-mind-list-select-modal">
                <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
                <div className="task-mind-item">
                    <TaskMindItem key={key}
                        edit={editHandle}
                        data={mind}
                    />
                </div>
                <div className="task-mind-operation">
                    <div className="operation-mind"
                        onClick={() => switchShow({ showTaskWay: 'listAll' })}
                    >任务列表</div>
                    <div className="operation-mind"
                        onClick={() => switchShow({ showTaskWay: 'listMind' })}
                    >思维列表</div>
                    <div className="operation-add" onClick={addHandle}>add</div>
                </div>
            </div>
        </Modal>
    }
}
