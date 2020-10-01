export default class TaskDetailModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
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
                        { name: '推迟', fun: () => {} },
                        { name: '删除', fun: () => {} },
                        { name: '完成', fun: () => {} },
                        { name: '暂存', fun: () => {} },
                        { name: '新增子节点', fun: () => {} },
                        { name: '取消', fun: () => {} },
                    ]}
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
