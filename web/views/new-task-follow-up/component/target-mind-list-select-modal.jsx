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
        const { Modal, PutOffButton, TaskMindItem, ListOperation } = this.props.children

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
                <ListOperation
                    leftButtonFun={() => switchShow({ showTaskWay: 'listAll' })}
                    leftButtonDes={'任务列表'}
                    rightOperation={[ { name: 'add', fun: addHandle } ]}
                />
            </div>
        </Modal>
    
    }
}
