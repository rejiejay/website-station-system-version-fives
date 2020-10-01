import inputPopUp from './../../../components/input-popup.jsx';

import Server from './../server.js';
import utils from './../utils.js';

export default class TargetMindListSelectModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            taskMindListData: []
        }

        this.todayGroupTaskRootId
    }

    async componentDidMount() {
        this.todayGroupTaskRootId = await utils.getTodayGroupTaskRootId()
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
        const { todayGroupTaskRootId } = this
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
                        isHighlight={mind.rooId === todayGroupTaskRootId}
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
