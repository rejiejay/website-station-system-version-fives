import fetch from './../../components/async-fetch/fetch.js';
import login from './../../components/login.js';
import { actionSheetPopUp } from './../../components/action-sheet.js';
import timeTransformers from './../../utils/time-transformers.js';

import CONST from './const.js';
import server from './server.js';

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
            putoff: null
        }

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
            this.storageTask = storageTask
            await this.initRootName(storageTask.rootid)
            return this.setState({
                title: storageTask.title,
                content: storageTask.content,
                SMART: storageTask.SMART,
                link: storageTask.link,
                putoff: storageTask.putoff,
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

        await this.initRootName(task.rootid)
        this.setState({
            title: task.title,
            content: task.content,
            SMART: task.SMART,
            link: task.link,
            putoff: task.putoff,
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

    render() {
        const self = this
        const { clientHeight } = this
        const { rootName, title, content, SMART, link, putoff } = this.state
        const smart = server.getJsonDataBySMART(SMART)
        const minHeight = clientHeight - 147

        return [
            <div className="mobile-header noselect">
                <div className="header-filter flex-start">
                    <div className="header-filter-des flex-rest flex-start-center">
                        <div className="header-filter-des flex-rest flex-center">关联</div>
                    </div>
                    <div className="header-filter-separation"></div>
                    <div className="header-filter-des flex-rest flex-start-center">
                        <div className="header-filter-des flex-rest flex-center">随机</div>
                    </div>
                </div>

                <div className="header-operating flex-start-center">
                    <div className="left-operating flex-start-center">
                        <div className="operat-item hover-item">New</div>
                    </div>

                    <div className="header-operating-description flex-rest flex-center">{rootName}</div>

                    <div className="right-operating flex-start-center">
                        <div className="operat-item" >
                            <svg width="16" height="16" t="1590236984624" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1134">
                                <path d="M224 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM544 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM864 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96z" p-id="1135"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>,

            <div className="mobile-content">
                <div className="mobile-container" style={{ minHeight: `${minHeight}px` }}>
                    {putoff && <div className="item-putoff flex-center">推迟的时间: {timeTransformers.dateToYYYYmmDDhhMM(new Date(+putoff))}</div>}

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
                <div className="mobile-operate-item">
                    <div className="operate-item-container flex-center"
                        onClick={() => window.location.href = `./edit/index.html?id=${id}`}
                    >编辑</div>
                </div>
                <div className="mobile-operate-item">
                    <div className="operate-item-container flex-center"
                        onClick={self.accomplishTask.bind(self)}
                    >完成</div>
                </div>
                <div className="mobile-operate-item">
                    <div className="operate-item-container flex-center">绑定结论</div>
                </div>
                <input readonly type="text"
                    id="picka-date"
                    style={{ display: 'none' }}
                    placeholder="时间?"
                />
                {putoff && <div className="mobile-operate-item">
                    <div className="operate-item-container flex-center">推迟</div>
                </div>}
                {!putoff && <div className="mobile-operate-item">
                    <div className="operate-item-container flex-center">取消推迟</div>
                </div>}
                <div className="mobile-operate-item">
                    <div className="operate-item-container flex-center">删除</div>
                </div>
            </div>
        ]
    }
}

