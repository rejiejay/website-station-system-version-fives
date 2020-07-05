import fetch from './../../components/async-fetch/fetch.js';
import login from './../../components/login.js';
import toast from './../../components/toast.js';
import { inputPopUp, inputPopUpDestroy } from './../../components/input-popup.js';
import { confirmPopUp } from './../../components/confirm-popup.js';
import timeTransformers from './../../utils/time-transformers.js';

import CONST from './const.js';
import server from './server.js';
import WindowsListItemComponent from './windows-list-item.jsx';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            /** 含义:过滤; 作用:使用输入的过滤名称来过滤任务 */
            filter: CONST.FILTER.DEFAULT,

            taskMindList: CONST.TASK.DEFAULT_LIST,

            executeTask: CONST.TASK.DEFAULT_ITEM,
            previewTask: CONST.TASK.DEFAULT_ITEM,

            isScrollDowm: false
        }

        this.rootTaskList = CONST.TASK.DEFAULT_LIST
        this.isChangeMindNode = false
        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        await login()
        await this.initRootTaskList()
        await this.initExecuteDetailTask()
        this.initRightFloat()
    }

    async initRootTaskList() {
        const self = this

        await fetch.get({
            url: 'task/list/root',
            query: {}
        }).then(
            ({ data }) => self.rootTaskList = data,
            error => { }
        )

        await self.initTaskMindList()
    }

    async initExecuteDetailTask() {
        const task = await server.getStorageTask()

        if (task) {
            this.setState({ executeTask: task, previewTask: task })
        } else {
            const executeTask = await this.initPreviewDetailTask()
            this.setState({ executeTask })
        }
    }

    async initPreviewDetailTask(id) {
        const self = this
        let previewTask = null

        if (id) {
            await fetch.get({
                url: 'task/id',
                query: { id }
            }).then(
                ({ data }) => {
                    previewTask = data
                    self.setState({ previewTask })
                },
                error => { }
            )

            return previewTask
        }

        return await this.initRandomPreviewDetailTask()
    }

    async initRandomPreviewDetailTask() {
        const self = this
        let previewTask = null

        await fetch.get({
            url: 'task/random',
            query: {}
        }).then(
            ({ data }) => {
                previewTask = data
                self.setState({ previewTask })
            },
            error => { }
        )

        return previewTask
    }

    async initTaskMindList() {
        const { rootTaskList } = this
        let taskMindList = []
        const getTaskMindBy = async rootTask => {
            let taskMindItem = JSON.parse(JSON.stringify(CONST.MIND_FORMAT))
            taskMindItem.meta.name = rootTask.title
            const rootMind = {
                isroot: true,
                id: rootTask.id,
                topic: rootTask.title
            }

            await fetch.get({
                url: 'task/list/group/by',
                query: { rootid: rootTask.id }
            }).then(
                ({ data }) => taskMindItem.data = [rootMind].concat(data.filter(task => task.parentid !== 'root').map(task => ({
                    id: +task.id,
                    parentid: +task.parentid,
                    topic: task.title,
                    putoff: task.putoff,
                    direction: 'right',
                    expanded: true
                }))),
                error => { }
            )

            return taskMindItem
        }

        for (let index = 0; index < rootTaskList.length; index++) {
            const rootTask = rootTaskList[index];
            const taskMindItem = await getTaskMindBy(rootTask)
            taskMindList.push(taskMindItem)
        }

        this.setState({ taskMindList })
    }

    initRightFloat() {
        const self = this

        window.onscroll = function () {
            const top = document.documentElement.scrollTop
            const { isScrollDowm } = self.state
            if (top >= 100 && !isScrollDowm) self.setState({ isScrollDowm: true })
            if (top < 100 && isScrollDowm) self.setState({ isScrollDowm: false })
        }
    }

    verifyTaskInExecute() {
        const { executeTask, previewTask } = this.state
        if (!previewTask || !executeTask || !previewTask.id || !executeTask.id) return false
        if (executeTask.id !== previewTask.id) return false
        return true
    }

    /**
     * 含义: 输入过滤字段名称
     */
    inputMindFilterHandle() {
        const self = this
        const { filter } = this.state

        const inputHandle = newFilter => {
            self.setState({ filter: newFilter })
            inputPopUpDestroy()
        }

        const defaultValue = filter

        inputPopUp({
            title: '请输入过滤任务的名称?',
            inputHandle,
            defaultValue
        })
    }

    async clickMindHandle({ mindNode, taskItem, refName }) {
        const { previewTask } = this.state
        const { isChangeMindNode } = this

        if (!isChangeMindNode) return this.initPreviewDetailTask(mindNode.id)

        const originalTask = previewTask.id
        const expectTask = mindNode.id

        await fetch.post({
            url: 'task/modify/parentid',
            body: { oldId: originalTask, newId: expectTask }
        }).then(
            ({ data }) => { },
            error => { }
        )

        await this.initTaskMindList()

        this.refs[refName].updateJsMind()
    }

    addMindNodeHandle() {
        const { previewTask } = this.state
        window.open(`./edit/index.html?rootid=${previewTask.rootid}&parentid=${previewTask.id}`)
    }

    changeMindNodeHandle() {
        toast.show('请选择节点')
        this.isChangeMindNode = true
    }

    accomplishTask() {
        const self = this
        const { previewTask } = this.state

        const handle = () => fetch.post({
            url: 'task/accomplish',
            body: { id: previewTask.id }
        }).then(
            ({ data }) => {
                self.updateTaskMindList()
                self.initRandomPreviewDetailTask()
            },
            error => { }
        )

        confirmPopUp({
            title: '你确定要完成这条数据吗?',
            succeedHandle: handle
        })
    }

    bindTaskLink() {
        const self = this
        const { previewTask } = this.state

        const inputHandle = async link => {
            fetch.post({
                url: 'task/bind/link',
                body: { id: previewTask.id, link }
            }).then(
                ({ data }) => self.initPreviewDetailTask(previewTask.id),
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

    timeStampHandle() {
        const self = this
        const nowYear = new Date().getFullYear()

        const handle = data => {
            const { previewTask } = self.state
            fetch.post({
                url: 'task/set/putoff',
                body: { id: previewTask.id, putoff: data }
            }).then(
                ({ data }) => self.initPreviewDetailTask(previewTask.id),
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
        const { previewTask } = this.state

        const handle = () => fetch.post({
            url: 'task/clear/putoff',
            body: { id: previewTask.id }
        }).then(
            ({ data }) => self.initPreviewDetailTask(previewTask.id),
            error => { }
        )

        confirmPopUp({
            title: '你确定要取消推迟吗?',
            succeedHandle: handle
        })
    }

    async updateTaskMindList() {
        const self = this
        const { filter } = this.state
        await this.initRootTaskList()

        this.state.taskMindList.filter(
            mind => filter ? mind.meta.name.includes(filter) : true
        ).map(
            (task, key) => self.refs[`mind_${task.meta.name}_${key}`].updateJsMind()
        )
    }

    delMindNodeHandle() {
        const self = this
        const { previewTask } = this.state

        const handle = () => fetch.post({
            url: 'task/del',
            body: { id: previewTask.id }
        }).then(
            ({ data }) => {
                self.updateTaskMindList()
                self.initRandomPreviewDetailTask()
            },
            error => { }
        )

        confirmPopUp({
            title: '你确定要删除任务吗?',
            succeedHandle: handle
        })
    }

    toExecuteTaskHandle() {
        const self = this
        const { previewTask } = this.state

        const handle = () => {
            self.setState({ executeTask: JSON.parse(JSON.stringify(previewTask)) })
            server.setStorageTask(previewTask)
        }

        confirmPopUp({
            title: '你确定要执行这个任务吗?',
            succeedHandle: handle
        })
    }

    render() {
        const self = this
        const { clientHeight, isChangeMindNode } = this
        const { filter, executeTask, taskMindList, previewTask, isScrollDowm } = this.state
        const minContentHeight = clientHeight - 185
        const taskMindHeight = clientHeight / 4 * 3; /** 显示3/4 */
        const isTaskExecute = this.verifyTaskInExecute()
        const smart = server.getJsonDataBySMART(previewTask && previewTask.SMART)

        setTimeout(() => tippy('[data-tippy-content]'), 500)

        /**
         * 含义: 重置操作
         * 初衷: 每当status发生改变的时候, 即不让重置
         */
        if (isChangeMindNode) this.isChangeMindNode = false

        return [
            <div className="windows-header flex-start-center noselect">
                <div className="left-operating flex-start-center">
                    <div className="operat-item hover-item"
                        onClick={this.inputMindFilterHandle.bind(this)}
                    >过滤: {filter ? filter : 'ALL'}</div>
                </div>

                <div className="center flex-rest"></div>

                <div className="right-operating flex-start-center">
                    {!isTaskExecute && <div className="operat-item hover-item"
                        onClick={() => self.setState({ previewTask: JSON.parse(JSON.stringify(executeTask)) })}
                    >查看当前正在执行的任务</div>}
                    <div className="operat-item hover-item"
                        onClick={this.initRandomPreviewDetailTask.bind(this)}
                    >随机查看</div>
                    <div className="operat-item hover-item">任务统计</div>
                    <div className="operat-item hover-item"
                        onClick={() => window.open('./edit/index.html?parentid=root')}
                    >新增根任务</div>
                </div>
            </div>,

            <div className="windows-content-container flex-start-top">
                <div className="windows-container-left flex-rest" style={{ minHeight: `${minContentHeight}px` }}>
                    {taskMindList.filter(mind => filter ? mind.meta.name.includes(filter) : true).map((task, key) => (
                        <WindowsListItemComponent
                            key={key}
                            ref={`mind_${task.meta.name}_${key}`}
                            className="left-list"
                            taskMindHeight={`${taskMindHeight}px`}
                            taskMindItem={task}
                            onSelectNodeHandle={mindNode => self.clickMindHandle({ mindNode, task, refName: `mind_${task.meta.name}_${key}` })}
                        >
                        </WindowsListItemComponent>
                    ))}
                </div>

                <div className="windows-separation"></div>

                {isScrollDowm && <div style={{ width: '640px' }} ></div>}
                <div className={isScrollDowm ? 'windows-container-flxed' : "windows-container-right"} style={{ minHeight: `${minContentHeight}px` }}>
                    <div className="item-container">
                        {previewTask && previewTask.putoff && <div className="item-putoff flex-center">推迟的时间: {timeTransformers.dateToYYYYmmDDhhMM(new Date(+previewTask.putoff))}</div>}

                        <div className="item-title flex-start-center">
                            <div className="flex-rest">{previewTask ? previewTask.title : '标题'}</div>
                            <div className="dont-want-todo noselect" data-tippy-content="点击查看详情"
                                onClick={() => window.open('./start-up-assist/index.html')}
                            >不想做怎么办?</div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">任务内容描述</div>
                                <div className="item-content-tip noselect" data-tippy-content="点击跳转需求系统">为什么要做这个?</div>
                            </div>
                            <div className="item-content-description item-content-main"
                                dangerouslySetInnerHTML={{ __html: previewTask ? `${previewTask && previewTask.content.replace(/\n/g, "<br>")}` : '内容' }}
                            ></div>
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

                        {previewTask && previewTask.link && <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">跟进</div>
                            </div>
                            <div className="item-content-link"
                                onClick={() => window.open(previewTask.link)}
                            ><div className="flex-center">点击查看进度</div></div>
                        </div>}
                    </div>
                    <div className="detail-operate flex-start-center noselect">
                        {!isTaskExecute && <div className="flex-rest flex-center"
                            onClick={self.toExecuteTaskHandle.bind(self)}
                        >执行</div>}
                        <div className="flex-rest flex-center"
                            onClick={this.accomplishTask.bind(this)}
                        >完成</div>
                        {previewTask && !previewTask.link && <div className="flex-rest flex-center"
                            onClick={this.bindTaskLink.bind(this)}
                        >绑定结论</div>}
                        <input readonly type="text"
                            id="picka-date"
                            style={{ display: 'none' }}
                            placeholder="时间?"
                            onClick={this.timeStampHandle.bind(this)}
                        />
                        {previewTask && !previewTask.putoff && <div className="flex-rest flex-center"
                            onClick={this.timeStampHandle.bind(this)}
                        >推迟</div>}
                        {previewTask && previewTask.putoff && <div className="flex-rest flex-center"
                            data-tippy-content={timeTransformers.dateToYYYYmmDDhhMM(new Date(+previewTask.putoff))}
                            onClick={this.timeStampClearHandle.bind(this)}
                        >取消推迟</div>}
                        <div className="flex-rest flex-center"
                            onClick={this.addMindNodeHandle.bind(this)}
                        >新增子节点</div>
                        {previewTask && previewTask.parentid !== 'root' && <div className="flex-rest flex-center"
                            onClick={self.changeMindNodeHandle.bind(self)}
                        >修改节点</div>}
                        <div className="flex-rest flex-center"
                            onClick={() => window.open(`./edit/index.html?id=${previewTask.id}`)}
                        >编辑</div>
                        <div className="flex-rest flex-center"
                            onClick={this.delMindNodeHandle.bind(this)}
                        >删除</div>
                    </div>
                </div>
            </div >,

            <div class="copyright-component"><div class="copyright-describe">粤ICP备17119404号 Copyright © Rejiejay曾杰杰</div></div>
        ]
    }
}
