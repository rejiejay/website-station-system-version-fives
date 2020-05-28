import login from './../../components/login.js';
import DropDownSelect from './../../components/drop-down-select-tooltip.jsx';

import CONST from './const.js';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
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
    }

    verifyPreviewExecuteTask() {
        const { executeTask, previewTask } = this.state
        if (!previewTask || !executeTask || !previewTask.id || !executeTask.id) return false
        if (executeTask.id !== executeTask.id) return false
        return true
    }

    filterHandle({ value, label }) {
        this.setState({
            filter: { id: value, label }
        })
    }

    render() {
        const self = this
        const { clientHeight } = this
        const { filter, rootTaskList, executeTask, previewTask } = this.state
        const minContentHeight = clientHeight - 185
        const minTaskHeight = minContentHeight / 3 * 2; /** 显示2/3 */
        const isPreviewExecuteTask = this.verifyPreviewExecuteTask()

        return [
            <div className="windows-header flex-start-center noselect">
                <div className="left-operating flex-start-center">
                    <DropDownSelect
                        options={rootTaskList.map(({ id, title }) => ({ value: id, label: title }))}
                        handle={this.filterHandle.bind(this)}
                    >
                        <div className="operat-item hover-item">过滤: {filter ? filter : 'ALL'}</div>
                    </DropDownSelect>
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
                    {rootTaskList.filter(task => filter ? task.title.includes(filter) : true).map((task, key) => (
                        <div className="left-list" key={key} style={{ minHeight: `${minTaskHeight}px` }}>
                            {/* 任务 */}
                        </div>
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
