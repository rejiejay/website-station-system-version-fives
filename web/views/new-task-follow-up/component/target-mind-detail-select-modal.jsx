export default class TargetMindDetailSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mind: null
        }
    }

    async show() { }

    render() {
        const { mind } = this.state
        const { editHandle, addHandle, switchShow, isShowPutOff, switchShowPutOff } = this.props
        const { Modal, PutOffButton, TaskMindItem, ListOperation } = this.props.children

        return <Modal
            visible
            maskClosable={false}
        >
            <div className="target-mind-list-select-modal">
                <PutOffButton status={isShowPutOff} handle={switchShowPutOff} />
                <div className="task-mind-item">
                    <TaskMindItem
                        edit={editHandle}
                        data={mind}
                    />
                </div>
                <ListOperation
                    leftButtonFun={() => switchShow({ showTaskWay: 'listMind' })}
                    leftButtonDes={'思维列表'}
                    rightOperation={[
                        { name: '任务列表', fun: () => switchShow({ showTaskWay: 'listAll' }) },
                        { name: 'add', fun: addHandle }
                    ]}
                />
            </div>
        </Modal>
    }
}
