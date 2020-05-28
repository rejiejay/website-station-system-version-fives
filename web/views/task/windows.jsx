import fetch from './../../components/async-fetch/fetch.js';
import login from './../../components/login.js';

import CONST from './const.js';
import WindowsListItemComponent from './windows-list-item.jsx';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            /** 含义:过滤; 作用:使用输入的过滤名称来过滤任务 */
            filter: CONST.FILTER.DEFAULT,

            rootTaskList: CONST.TASK.DEFAULT_LIST,
            taskMindList: CONST.TASK.DEFAULT_LIST,

            executeTask: CONST.TASK.DEFAULT_ITEM,
            previewTask: CONST.TASK.DEFAULT_ITEM
        }

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        tippy('[data-tippy-content]');
        await login()
        await this.initRootTaskList()
    }

    async initRootTaskList() {
        const self = this

        await fetch.get({
            url: 'task/list/root',
            query: {}
        }).then(
            ({ data }) => self.setState(
                { rootTaskList: data },
                self.initTaskMindList
            ),
            error => { }
        )
    }

    async initTaskMindList() {
        const self = this
        const { rootTaskList } = this.state
        let taskMindList = []
        const getTaskMindBy = async rootTask => {
            let taskMindItem = CONST.MIND_FORMAT
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
                ({ data }) => taskMindItem.data = [rootMind].concat(data.map(task => ({
                    id: +task.id,
                    parentid: +task.parentid,
                    topic: task.title,
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

    verifyPreviewExecuteTask() {
        const { executeTask, previewTask } = this.state
        if (!previewTask || !executeTask || !previewTask.id || !executeTask.id) return false
        if (executeTask.id !== executeTask.id) return false
        return true
    }

    /**
     * 含义: 输入过滤字段名称
     */
    inputMindFilterHandle() {

    }

    render() {
        const self = this
        const { clientHeight } = this
        const { filter, executeTask, taskMindList, previewTask } = this.state
        const minContentHeight = clientHeight - 185
        const taskMindHeight = clientHeight / 4 * 3; /** 显示3/4 */
        const isPreviewExecuteTask = this.verifyPreviewExecuteTask()

        return [
            <div className="windows-header flex-start-center noselect">
                <div className="left-operating flex-start-center">
                    <div className="operat-item hover-item"
                        onClick={this.inputMindFilterHandle.bind(this)}
                    >过滤: {filter ? filter : 'ALL'}</div>
                </div>

                <div className="center flex-rest"></div>

                <div className="right-operating flex-start-center">
                    {!isPreviewExecuteTask && <div className="operat-item hover-item"
                        onClick={() => self.setState({ previewTask: JSON.parse(JSON.stringify(executeTask)) })}
                    >查看当前正在执行的任务</div>}
                    <div className="operat-item hover-item">随机查看</div>
                    <div className="operat-item hover-item">任务统计</div>
                    <div className="operat-item hover-item">新增根任务</div>
                </div>
            </div>,

            <div className="windows-content-container flex-start-top">
                <div className="windows-container-left flex-rest" style={{ minHeight: `${minContentHeight}px` }}>
                    {taskMindList.filter(mind => filter ? mind.meta.name.includes(filter) : true).map((task, key) => (
                        <WindowsListItemComponent
                            key={key}
                            className="left-list"
                            taskMindHeight={`${taskMindHeight}px`}
                            taskMindItem={task}
                        >
                        </WindowsListItemComponent>
                    ))}
                </div>

                <div className="windows-separation"></div>

                <div className="windows-container-right" style={{ minHeight: `${minContentHeight}px` }}>
                    <div className="item-container">
                        {previewTask && previewTask.putoff && <div className="item-putoff flex-center">推迟的时间: 2020-08-10 18:02</div>}

                        <div className="item-title flex-start-center">
                            <div className="flex-rest">标题</div>
                            <div className="dont-want-todo noselect" data-tippy-content="点击查看详情">不想做怎么办?</div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">任务内容描述</div>
                                <div className="item-content-tip noselect" data-tippy-content="点击跳转需求系统">为什么要做这个?</div>
                            </div>
                            <div className="item-content-description item-content-main">
                                内容内容
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">达成任务的具体行为标准?（给未来的自己）</div>
                                <div className="item-content-tip noselect" data-tippy-content="清楚地说明要达成的行为标准，不明确就没有办法评判、衡量。">Specific</div>
                            </div>
                            <div className="item-content-description">
                                内容内容
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">是否可衡量目标的完成度?（给未来的自己）</div>
                                <div className="item-content-tip noselect" data-tippy-content="杜绝在目标设置中使用形容词等概念模糊、无法衡量的描述、这对自己非常重要！">Measurable</div>
                            </div>
                            <div className="item-content-description">
                                内容内容
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">可实现?并能够被未来的自己所接受?</div>
                                <div className="item-content-tip noselect" data-tippy-content="要知道长期无法可实现的目标就非常打击积极性">Attainable</div>
                            </div>
                            <div className="item-content-description">
                                内容内容
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">是否和需求相关联，不要跑题</div>
                                <div className="item-content-tip noselect" data-tippy-content="你想学英语，却让自己看美剧（相关性非常低）">Relevant</div>
                            </div>
                            <div className="item-content-description">
                                内容内容
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">时限性</div>
                                <div className="item-content-tip noselect" data-tippy-content="一直学一直学，时间过去了，自己还在原地徘徊、这就没意思了">Time-bound</div>
                            </div>
                            <div className="item-content-description">
                                内容内容
                            </div>
                        </div>

                        {previewTask && previewTask.link && <div className="item-content">
                            <div className="item-content-title flex-start-center">
                                <div className="flex-rest">跟进</div>
                            </div>
                            <div className="item-content-link"><div className="flex-center">点击查看进度</div></div>
                        </div>}
                    </div>
                    <div className="detail-operate flex-start-center noselect">
                        {!isPreviewExecuteTask && <div className="flex-rest flex-center">执行</div>}
                        <div className="flex-rest flex-center">完成</div>
                        {previewTask && !previewTask.link && <div className="flex-rest flex-center">绑定结论</div>}
                        {previewTask && !previewTask.putoff && <div className="flex-rest flex-center">推迟</div>}
                        {previewTask && previewTask.putoff && <div className="flex-rest flex-center">取消推迟</div>}
                        <div className="flex-rest flex-center">新增子节点</div>
                        <div className="flex-rest flex-center">修改节点</div>
                        <div className="flex-rest flex-center">编辑</div>
                        <div className="flex-rest flex-center">删除</div>
                    </div>
                </div>
            </div >,

            <div class="copyright-component"><div class="copyright-describe">粤ICP备17119404号 Copyright © Rejiejay曾杰杰</div></div>
        ]
    }
}
