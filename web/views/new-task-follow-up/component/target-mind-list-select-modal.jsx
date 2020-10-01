export default class TargetMindListSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            taskMindListData: []
        }
    }

    async show() { }

    render() {
        const { taskMindListData } = this.state
        const { addHandle, switchShow, isShowPutOff, switchShowPutOff } = this.props
        const { Modal, PutOffButton, TaskMindItem } = this.props.children

        return <Modal
            visible
            maskClosable={false}
        >
            <div className="target-mind-list-select-modal">
                <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
                <div className="task-mind-item">{taskMindListData.map((mind, key) =>
                    <TaskMindItem key={key}
                        click={() => switchShow({ showTaskWay: 'mindDetailSelect', groupId: mind.rooId })}
                        data={mind}
                    />
                )}</div>
                <div className="task-mind-operation">
                    <div className="operation-mind"
                        onClick={() => switchShow({ showTaskWay: 'listAll' })}
                    >任务列表</div>
                    <div className="operation-add" onClick={addHandle}>add</div>
                </div>
            </div>
        </Modal>
    
    }
}
