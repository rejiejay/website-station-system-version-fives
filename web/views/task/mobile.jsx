import fetch from './../../components/async-fetch/fetch.js';
import login from './../../components/login.js';
import { actionSheetPopUp } from './../../components/action-sheet.js';
import toast from './../../components/toast.js';
import { inputPopUp, inputPopUpDestroy } from './../../components/input-popup.js';
import { confirmPopUp } from './../../components/confirm-popup.js';
import timeTransformers from './../../utils/time-transformers.js';

import CONST from './const.js';
import server from './server.js';
import MobileMindComponent from './mobile-mind.jsx';
import MobileGuideComponent from './mobile-guide.jsx';

export default class MobileComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            rootName: '',
            id: null,
            title: '',
            content: '',
            SMART: '',
            link: '',
            putoff: null,
            complete: null
        }

        this.rootTaskList = CONST.TASK.DEFAULT_LIST
        this.executeTask = null
        this.storageTask = null

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        await login()
        await this.initExecuteDetailTask()
    }

    async initExecuteDetailTask() {
        const storageTask = await server.getStorageTask()

        if (storageTask) {
            this.storageTask = JSON.parse(JSON.stringify(storageTask))
            this.executeTask = JSON.parse(JSON.stringify(storageTask))
            await this.initRootName(storageTask.rootid)
            return this.setState({
                id: storageTask.id,
                title: storageTask.title,
                content: storageTask.content,
                SMART: storageTask.SMART,
                link: storageTask.link,
                putoff: storageTask.putoff,
                complete: storageTask.complete
            })
        }

        await this.initRandomTask()
    }

    async initRootName(rootId) {
        const self = this

        await fetch.get({
            url: 'task/id',
            query: { id: rootId }
        }).then(
            ({ data }) => self.setState({ rootName: data.title }),
            error => { }
        )
    }

    async initRandomTask() {
        let task = null

        await fetch.get({
            url: 'task/random',
            query: {}
        }).then(
            ({ data }) => task = data,
            error => { }
        )

        this.executeTask = JSON.parse(JSON.stringify(task))
        await this.initRootName(task.rootid)
        this.setState({
            id: task.id,
            title: task.title,
            content: task.content,
            SMART: task.SMART,
            link: task.link,
            putoff: task.putoff,
            complete: task.complete
        })
    }

    accomplishTask() {
        const self = this
        const { id } = this

        const handle = () => fetch.post({
            url: 'task/accomplish',
            body: { id }
        }).then(
            ({ data }) => self.initRandomTask(),
            error => { }
        )

        confirmPopUp({
            title: '你确定要完成这条数据吗?',
            succeedHandle: handle
        })
    }

    verifyTaskInExecute() {
        const { storageTask } = this
        const { id } = this.state
        if (!id || !storageTask || !storageTask.id) return false
        if (storageTask.id !== id) return false
        return true
    }

    async toExecuteTaskHandle() {
        const self = this
        const { executeTask } = this

        const handle = async () => {
            await self.initRootName(executeTask.rootid)
            server.setStorageTask(executeTask)
            self.storageTask = JSON.parse(JSON.stringify(executeTask))
            self.setState({
                id: executeTask.id,
                title: executeTask.title,
                content: executeTask.content,
                SMART: executeTask.SMART,
                link: executeTask.link,
                putoff: executeTask.putoff,
                complete: executeTask.complete
            })
        }

        confirmPopUp({
            title: '你确定要执行这个任务吗?',
            succeedHandle: handle
        })
    }

    async backExecuteTaskHandle() {
        const { storageTask } = this
        await this.initRootName(storageTask.rootid)
        this.setState({
            id: storageTask.id,
            title: storageTask.title,
            content: storageTask.content,
            SMART: storageTask.SMART,
            link: storageTask.link,
            putoff: storageTask.putoff,
            complete: storageTask.complete
        })
    }

    bindTaskLink() {
        const self = this
        const { id } = this.state

        const inputHandle = async link => {
            fetch.post({
                url: 'task/bind/link',
                body: { id, link }
            }).then(
                () => self.updateExecuteTask({ key: 'link', value: link }),
                error => { }
            )

            inputPopUpDestroy()
        }

        const defaultValue = `./../record/index.html?tag=`

        inputPopUp({
            title: '请输入绑定任务的链接?',
            inputHandle,
            defaultValue
        })
    }

    updateExecuteTask({ key, value }) {
        let state = this.state
        state[key] = value
        this.setState(state)
        this.executeTask[key] = value
        this.storageTask[key] = value
        server.setStorageTask(this.executeTask)
    }

    timeStampHandle() {
        const self = this
        const { id } = this.state
        const nowYear = new Date().getFullYear()

        const handle = putoff => {
            fetch.post({
                url: 'task/set/putoff',
                body: { id, putoff }
            }).then(
                () => self.updateExecuteTask({ key: 'putoff', value: putoff }),
                error => { }
            )
        }

        const datepicker = new Rolldate({
            el: '#picka-date',
            format: 'YYYY-MM-DD hh:mm',
            beginYear: nowYear - 10,
            endYear: nowYear + 10,
            lang: { title: '当时时间?' },
            confirm: function confirm(date) {
                const timestamp = timeTransformers.YYYYmmDDhhMMToTimestamp(date)
                handle(timestamp)
            }
        })

        datepicker.show()
    }

    timeStampClearHandle() {
        const self = this
        const { id } = this.state

        const handle = () => fetch.post({
            url: 'task/clear/putoff',
            body: { id }
        }).then(
            () => self.updateExecuteTask({ key: 'putoff', value: null }),
            error => { }
        )

        confirmPopUp({
            title: '你确定要取消推迟吗?',
            succeedHandle: handle
        })
    }

    deleteTaskHandle() {
        const self = this
        const { id } = this.state

        const handle = () => fetch.post({
            url: 'task/del',
            body: { id }
        }).then(
            () => self.initRandomTask(),
            error => { }
        )

        confirmPopUp({
            title: '你确定要删除任务吗?',
            succeedHandle: handle
        })
    }

    selectMindNodeHandle() {
        const self = this
        const { rootTaskList } = this

        const mindHandle = id => fetch.get({
            url: 'task/id',
            query: { id }
        }).then(
            async ({ data }) => {
                await self.initRootName(data.rootid)
                self.setState({
                    id: data.id,
                    title: data.title,
                    content: data.content,
                    SMART: data.SMART,
                    link: data.link,
                    putoff: data.putoff,
                    complete: data.complete
                })
            },
            error => { }
        )

        const rootTaskSelectHandle = ({ label, value }) => self.refs.mind.selectNodeByRootId(value)
            .then(
                id => mindHandle(id),
                error => { }
            )

        const handle = ({ label, value }) => {
            switch (value) {
                case 1:
                    actionSheetPopUp({
                        title: '请选择根类型',
                        options: rootTaskList.map(task => ({ label: task.title, value: task.id })),
                        rootTaskSelectHandle
                    })
                    break;
                case 2:
                    self.refs.mind.selectNode()
                        .then(
                            id => mindHandle(id),
                            error => { }
                        )
                    break;
                default:
                    break;
            }
        }

        actionSheetPopUp({
            title: '请选择查看类型',
            options: [{ label: '根', value: 1 }, { label: '节点', value: 2 }],
            handle
        })
    }

    async relatedMindNodeHandle() {
        const self = this
        const { executeTask } = this

        const handle = async id => await fetch.post({
            url: 'task/modify/parentid',
            body: { oldId: executeTask.id, newId: id }
        }).then(
            ({ data }) => toast.show('修改成功'),
            error => { }
        )

        this.refs.mind.selectNode()
            .then(
                id => mindHandle(id),
                error => { }
            )
    }

    showNewActionSheet() {
        const self = this
        const { executeTask } = this
        const handle = ({ label, value }) => {
            switch (value) {
                case 1:
                    window.location.href = './edit/index.html?parentid=root'
                    break;
                case 2:
                    self.refs.mind.selectNode()
                        .then(
                            id => window.location.href = `./edit/index.html?rootid=${executeTask.rootid}&parentid=${id}`,
                            error => { }
                        )
                    break;
                case 3:
                    window.location.href = `./edit/index.html?rootid=${executeTask.rootid}&parentid=${executeTask.id}`
                    break;
                default:
                    break;
            }
        }

        actionSheetPopUp({
            title: '请选择新增类型',
            options: [{ label: '新增根', value: 1 }, { label: '新增节点', value: 2 }, { label: '新增子节点', value: 3 }],
            handle
        })
    }

    render() {
        const self = this
        const { clientHeight, executeTask } = this
        const { rootName, id, title, content, SMART, link, putoff, complete } = this.state
        const smart = server.getJsonDataBySMART(SMART)
        const minHeight = clientHeight - 147
        const isTaskExecute = this.verifyTaskInExecute()

        return [
            <div className="mobile-header noselect">
                <div className="header-filter flex-start">
                    <div className="header-filter-des flex-rest flex-start-center"
                        onClick={this.relatedMindNodeHandle.bind(this)}
                    >
                        <div className="header-filter-des flex-rest flex-center">关联</div>
                    </div>
                    <div className="header-filter-separation"></div>
                    <div className="header-filter-des flex-rest flex-start-center"
                        onClick={self.initRandomTask.bind(self)}
                    >
                        <div className="header-filter-des flex-rest flex-center">随机</div>
                    </div>
                </div>

                <div className="header-operating flex-start-center">
                    <div className="left-operating flex-start-center">
                        <div className="operat-item hover-item"
                            onClick={this.showNewActionSheet.bind(this)}
                        >New</div>
                    </div>

                    <div className="header-operating-description flex-rest flex-center"
                        onClick={this.selectMindNodeHandle.bind(this)}
                    >{rootName}</div>

                    <div className="right-operating flex-start-center">
                        <div className="operat-item"
                            onClick={() => this.refs.guide.setShow()}
                        >
                            <svg width="16" height="16" t="1590236984624" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1134">
                                <path d="M224 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM544 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM864 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96z" p-id="1135"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div >,

            <div className="mobile-content">
                <div className="mobile-container" style={{ minHeight: `${minHeight}px` }}>
                    {putoff && <div className="item-putoff flex-center">推迟的时间: {timeTransformers.dateToYYYYmmDDhhMM(new Date(+putoff))}</div>}
                    {complete && <div className="item-complete flex-center">任务的时间: {timeTransformers.dateToYYYYmmDDhhMM(new Date(+complete))}</div>}

                    <div className="item-title flex-start-center">
                        <div className="flex-rest">{title || '标题'}</div>
                        <div className="dont-want-todo noselect" data-tippy-content="点击查看详情"
                            onClick={() => window.open('./start-up-assist/index.html')}
                        >不想做怎么办?</div>
                    </div>

                    <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">任务内容描述</div>
                            <div className="item-content-tip noselect" data-tippy-content="点击跳转需求系统">为什么要做这个?</div>
                        </div>
                        <div className="item-content-description item-content-main">{content || '内容'}</div>
                    </div>

                    {smart.specific && <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">达成任务的具体行为标准?（给未来的自己）</div>
                            <div className="item-content-tip noselect" data-tippy-content="清楚地说明要达成的行为标准，不明确就没有办法评判、衡量。">Specific</div>
                        </div>
                        <div className="item-content-description">{smart.specific}</div>
                    </div>}

                    {smart.measurable && <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">是否可衡量目标的完成度?（给未来的自己）</div>
                            <div className="item-content-tip noselect" data-tippy-content="杜绝在目标设置中使用形容词等概念模糊、无法衡量的描述、这对自己非常重要！">Measurable</div>
                        </div>
                        <div className="item-content-description">{smart.measurable}</div>
                    </div>}

                    {smart.attainable && <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">可实现?并能够被未来的自己所接受?</div>
                            <div className="item-content-tip noselect" data-tippy-content="要知道长期无法可实现的目标就非常打击积极性">Attainable</div>
                        </div>
                        <div className="item-content-description">{smart.attainable}</div>
                    </div>}

                    {smart.relevant && <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">是否和需求相关联，不要跑题</div>
                            <div className="item-content-tip noselect" data-tippy-content="你想学英语，却让自己看美剧（相关性非常低）">Relevant</div>
                        </div>
                        <div className="item-content-description">{smart.relevant}</div>
                    </div>}

                    {smart.timeBound && <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">{smart.timeBound ? smart.timeBound : '时限性'}</div>
                            <div className="item-content-tip noselect" data-tippy-content="一直学一直学，时间过去了，自己还在原地徘徊、这就没意思了">Time-bound</div>
                        </div>
                        <div className="item-content-description">{smart.timeBound}</div>
                    </div>}

                    {link && <div className="item-content">
                        <div className="item-content-title flex-start-center">
                            <div className="flex-rest">跟进</div>
                        </div>
                        <div className="item-content-link"
                            onClick={() => window.open(link)}
                        ><div className="flex-center">点击查看进度</div></div>
                    </div>}
                </div>
            </div>,

            <div className="mobile-operate">
                {!isTaskExecute && [
                    <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            style={{ backgroundColor: '#1890ff', color: '#fff' }}
                            onClick={self.toExecuteTaskHandle.bind(self)}
                        >执行</div>
                    </div>,
                    <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={self.backExecuteTaskHandle.bind(self)}
                        >返回</div>
                    </div>
                ]}

                {isTaskExecute && [
                    <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={() => window.location.href = `./edit/index.html?id=${id}`}
                        >编辑</div>
                    </div>,
                    <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={self.accomplishTask.bind(self)}
                        >完成</div>
                    </div>,
                    <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={this.bindTaskLink.bind(this)}
                        >绑定结论</div>
                    </div>,
                    <input readonly type="text"
                        id="picka-date"
                        style={{ display: 'none' }}
                        placeholder="时间?"
                    />,
                    !putoff && <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={this.timeStampHandle.bind(this)}
                        >推迟</div>
                    </div>,
                    putoff && <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={this.timeStampClearHandle.bind(this)}
                        >取消推迟</div>
                    </div>,
                    <div className="mobile-operate-item">
                        <div className="operate-item-container flex-center"
                            onClick={this.deleteTaskHandle.bind(this)}
                        >删除</div>
                    </div>
                ]}
            </div>,

            <MobileMindComponent
                ref="mind"
                rootId={executeTask && executeTask.rootid}
            ></MobileMindComponent>,

            <MobileGuideComponent
                ref="guide"
                selectMindNodeHandle={this.selectMindNodeHandle.bind(this)}
                showNewActionSheet={this.showNewActionSheet.bind(this)}
            ></MobileGuideComponent>
        ]
    }
}

