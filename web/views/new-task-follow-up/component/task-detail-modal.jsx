export default class TaskDetailModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { Modal } = this.props.children

        return <Modal
            visible
            maskClosable={false}
        >
            <div className="task-detail-modal">
                <div className="task-detail-input">
                    <InputComponent></InputComponent>
                </div>
                <div className="task-detail-operate">
                    <div className="task-operate-button">推迟</div>
                    <div className="task-operate-button">删除</div>
                    <div className="task-operate-button">完成</div>
                    <div className="task-operate-button">暂存</div>
                    <div className="task-operate-button">取消</div>
                </div>
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
        return <div className="task-detail-modal">
        </div>
    }
}
