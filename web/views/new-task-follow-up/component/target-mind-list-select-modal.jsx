import inputPopUp from './../../../components/input-popup.jsx';

import Server from './../server.js';

export default class TargetMindListSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            taskMindListData: []
        }
    }

    async show() { }

    async addNewRootMind(reGetRootMindName) {
        const { taskMindListData } = this.state

        if (!reGetRootMindName) this.rootMindName = await inputPopUp()
        const rootMindName = reGetRootMindName ? reGetRootMindName : this.rootMindName
        const fetchInstance = await Server.addNewRootMind({ rootMindName })
        // if (fetchInstance.result !== 1) return reGetConfirm(fetchtInstance.message, () => this.addNewRootMind(rootMindName))
        // const taskMind = fetchInstance.data
        // this.setState({ taskMindListData: [taskMind, ...taskMindListData] })
    }

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
                <div className="target-mind-add"
                    onClick={this.addNewRootMind.bind(this)}
                >新增Mind</div>
                <div className="task-mind-item">{taskMindListData.map((mind, key) =>
                    <TaskMindItem key={key}
                        click={() => switchShow({ showTaskWay: 'mindDetailSelect', groupId: mind.rooId })}
                        data={mind}
                    />
                )}</div>
                <ListOperation
                    leftButtonFun={() => switchShow({ showTaskWay: 'listAll' })}
                    leftButtonDes={'任务列表'}
                    rightOperation={[{ name: 'add', fun: addHandle }]}
                />
            </div>
        </Modal>

    }
}
