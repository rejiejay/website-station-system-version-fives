import fetch from './../../../components/async-fetch/fetch.js';
import { loadPageVar } from './../../../utils/url-handle.js';
import { confirmPopUp } from './../../../components/confirm-popup.js';
import timeTransformers from './../../../utils/time-transformers.js';
import { inputPopUp, inputPopUpDestroy } from './../../../components/input-popup.js';

import CONST from './const.js';
import TASK_CONST from './../const.js';
import server from './../server.js';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pageStatus: CONST.PAGE_STATUS.DEFAULTS,

            title: '',
            content: '',
            /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */
            SMART: '',
            /** 作用: 绑定结论 */
            link: '',
            putoff: null
        }

        this.id = null
        this.parentid = null
        this.rootid = null
        this.data = TASK_CONST.TASK.DEFAULT_ITEM

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        this.initPageVar()
    }

    initPageVar() {
        const id = loadPageVar('id')
        const parentid = loadPageVar('parentid')
        const rootid = loadPageVar('rootid')
        let pageStatus = CONST.PAGE_STATUS.DEFAULTS

        this.id = id

        if (id) {
            pageStatus = CONST.PAGE_STATUS.EDIT
            this.initData(id)
            this.setState({ pageStatus })
        } else if (parentid && rootid) {
            pageStatus = CONST.PAGE_STATUS.ADD
            this.parentid = parentid
            this.rootid = rootid
            this.setState({ pageStatus })
        } else if (parentid && !rootid) {
            pageStatus = CONST.PAGE_STATUS.ADD_ROOT
            this.parentid = parentid
            this.rootid = rootid
            this.setState({ pageStatus })
        }
    }

    initData(id) {
        const self = this

        fetch.get({
            url: 'task/id',
            query: { id }
        }).then(
            ({ data }) => {
                self.data = data
                self.setState({
                    title: data.title,
                    content: data.content,
                    SMART: data.SMART,
                    link: data.link,
                    putoff: data.putoff
                })
            },
            error => { }
        )
    }

    editHandle() {
        const self = this
        const { id } = this
        const { title, content, SMART, link, putoff } = this.state

        fetch.post({
            url: 'task/edit',
            body: { id, title, content, SMART, link, putoff }
        }).then(
            ({ data }) => {
                self.data = data
                self.setState({
                    title: data.title,
                    content: data.content,
                    SMART: data.SMART,
                    link: data.link,
                    putoff: data.putoff
                })
            },
            error => { }
        )
    }

    putoffHandle() {
        const self = this
        const nowYear = new Date().getFullYear()

        const handle = data => self.setState({ putoff: data })

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

    clearPutoffHandle() {
        const self = this

        const handle = () => self.setState({ putoff: null })

        confirmPopUp({
            title: '你确定要取消推迟吗?',
            succeedHandle: handle
        })
    }

    verifyEditDiff() {
        const { data } = this
        const { pageStatus } = this.state

        if (pageStatus !== CONST.PAGE_STATUS.EDIT) return false

        const { title, content, SMART, link, putoff } = this.state

        let isDiff = false
        if (data && title !== data.title) isDiff = true
        if (data && content !== data.content) isDiff = true
        if (data && SMART !== data.SMART) isDiff = true
        if (data && link !== data.link) isDiff = true
        if (data && putoff !== data.putoff) isDiff = true
        return isDiff
    }

    bindTaskLink() {
        const self = this

        const inputHandle = async link => {
            self.setState({ link })
            inputPopUpDestroy()
        }

        const defaultValue = `./../record/index.html?tag=`

        inputPopUp({
            title: '请输入绑定任务的链接?',
            inputHandle,
            defaultValue
        })
    }

    deleteHandle() {
        const self = this

        const handle = () => fetch.post({
            url: 'task/del',
            body: { id: self.id }
        }).then(
            ({ data }) => window.location.href = './../index.html',
            error => { }
        )

        confirmPopUp({
            title: '你确定要删除任务吗?',
            succeedHandle: handle
        })
    }

    addHandle() {
        const { parentid, rootid } = this
        const { title, content, SMART, link, putoff, pageStatus } = this.state

        if (pageStatus === CONST.PAGE_STATUS.ADD) {
            fetch.post({
                url: 'task/add',
                body: { parentid, rootid, title, content, SMART, link, putoff }
            }).then(
                ({ data }) => window.location.replace(`./index.html?id=${data.id}`),
                error => { }
            )
        }

        if (pageStatus === CONST.PAGE_STATUS.ADD_ROOT) {
            fetch.post({
                url: 'task/add/root',
                body: { title, content, SMART, link, putoff }
            }).then(
                ({ data }) => window.location.replace(`./index.html?id=${data.id}`),
                error => { }
            )
        }
    }

    accomplishTask() {
        const { id } = this

        const handle = () => fetch.post({
            url: 'task/accomplish',
            body: { id }
        }).then(
            ({ data }) => window.location.href = './../index.html',
            error => { }
        )

        confirmPopUp({
            title: '你确定要完成这条数据吗?',
            succeedHandle: handle
        })
    }

    render() {
        const self = this
        const { title, content, SMART, link, putoff, pageStatus } = this.state
        const { clientHeight } = this
        const minHeight = clientHeight - 125
        const smart = server.getJsonDataBySMART(SMART)

        setTimeout(() => tippy('[data-tippy-content]'), 500)

        if (pageStatus === CONST.PAGE_STATUS.DEFAULTS) return (<div>页面参数有误</div>)

        return (
            <div className="windows flex-column-center">
                <div className="windows-container flex-start-top" style={{ minHeight }}>
                    <div className="windows-container-left flex-rest">
                        <div className="title-input flex-center">
                            <input type="text" placeholder="简单描述/提问"
                                value={title}
                                onChange={({ target: { value } }) => this.setState({ title: value })}
                            />
                        </div>
                        <div className="content-input">

                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder='任务内容'
                                style={{ height: minHeight }}
                                value={content}
                                onChange={({ target: { value } }) => this.setState({ content: value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="windows-separation"></div>

                    <div className="windows-container-right flex-rest">
                        {putoff && <div className="windows-right-putoff flex-center">推迟的时间: {timeTransformers.dateToYYYYmmDDhhMM(new Date(putoff))}</div>}

                        {link && <div className="windows-right-link flex-center"
                            onClick={() => window.open(link)}
                        >绑定地址: {link}</div>}

                        <div className="soft-operate flex-start">
                            <input readonly type="text" id="picka-date" style={{ display: 'none' }} placeholder="推迟?" />
                            {!putoff && <div className="soft-operate-item flex-center flex-rest"
                                onClick={this.putoffHandle.bind(this)}
                            >推迟?</div>}
                            {putoff && <div className="soft-operate-item flex-center flex-rest"
                                onClick={this.clearPutoffHandle.bind(this)}
                            >取消推迟</div>}
                            <div className="soft-operate-item flex-center flex-rest"
                                onClick={this.bindTaskLink.bind(this)}
                            >绑定结论</div>
                            {pageStatus === CONST.PAGE_STATUS.EDIT && self.verifyEditDiff() &&
                                <div className="soft-operate-item flex-center flex-rest"
                                    onClick={this.editHandle.bind(this)}
                                >暂存</div>
                            }
                        </div>

                        <div className="other-input">
                            <div className="content-input"
                                data-tippy-content="清楚地说明要达成的行为标准，不明确就没有办法评判、衡量。"
                            >
                                <div className="content-input-title">达成任务的具体行为标准?（给未来的自己）</div>
                                <textarea className="content-textarea fiex-rest" type="text"
                                    placeholder="达成任务的具体行为标准?（给未来的自己）"
                                    style={{ height: '105px' }}
                                    value={smart.specific}
                                    onChange={({ target: { value } }) => self.setState({ SMART: server.updateSMARThandle({ smart, key: 'specific', value }) })}
                                ></textarea>
                            </div>
                            <div className="content-input"
                                data-tippy-content="杜绝在目标设置中使用形容词等概念模糊、无法衡量的描述、这对自己非常重要！"
                            >
                                <div className="content-input-title">是否可衡量目标的完成度?（给未来的自己）</div>
                                <textarea className="content-textarea fiex-rest" type="text"
                                    placeholder="是否可衡量目标的完成度?（给未来的自己）"
                                    style={{ height: '105px' }}
                                    value={smart.measurable}
                                    onChange={({ target: { value } }) => self.setState({ SMART: server.updateSMARThandle({ smart, key: 'measurable', value }) })}
                                ></textarea>
                            </div>
                            <div className="content-input"
                                data-tippy-content="要知道长期无法可实现的目标就非常打击积极性"
                            >
                                <div className="content-input-title">可实现?并能够被未来的自己所接受?</div>
                                <textarea className="content-textarea fiex-rest" type="text"
                                    placeholder="可实现?并能够被未来的自己所接受?"
                                    style={{ height: '105px' }}
                                    value={smart.attainable}
                                    onChange={({ target: { value } }) => self.setState({ SMART: server.updateSMARThandle({ smart, key: 'attainable', value }) })}
                                ></textarea>
                            </div>
                            <div className="content-input"
                                data-tippy-content="你想学英语，却让自己看美剧（相关性非常低）"
                            >
                                <div className="content-input-title">是否和需求相关联，不要跑题</div>
                                <textarea className="content-textarea fiex-rest" type="text"
                                    placeholder="是否和需求相关联，不要跑题"
                                    style={{ height: '105px' }}
                                    value={smart.relevant}
                                    onChange={({ target: { value } }) => self.setState({ SMART: server.updateSMARThandle({ smart, key: 'relevant', value }) })}
                                ></textarea>
                            </div>
                            <div className="content-input"
                                data-tippy-content="一直学一直学，时间过去了，自己还在原地徘徊、这就没意思了"
                            >
                                <div className="content-input-title">时限性</div>
                                <textarea className="content-textarea fiex-rest" type="text"
                                    placeholder="时限性"
                                    style={{ height: '105px' }}
                                    value={smart.timeBound}
                                    onChange={({ target: { value } }) => self.setState({ SMART: server.updateSMARThandle({ smart, key: 'timeBound', value }) })}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="windows-operate flex-start">
                    {pageStatus !== CONST.PAGE_STATUS.EDIT &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.addHandle.bind(this)}
                        >新增{pageStatus === CONST.PAGE_STATUS.ADD_ROOT ? '根' : ''}</div>
                    }
                    <div className="windows-operate-item flex-center flex-rest"
                        onClick={() => window.location.href = './../index.html'}
                    >关闭</div>
                    {pageStatus === CONST.PAGE_STATUS.EDIT &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.accomplishTask.bind(this)}
                        >完成任务</div>
                    }
                    {pageStatus === CONST.PAGE_STATUS.EDIT && self.verifyEditDiff() &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.editHandle.bind(this)}
                        >暂存</div>
                    }
                    {pageStatus === CONST.PAGE_STATUS.EDIT &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.deleteHandle.bind(this)}
                        >删除</div>
                    }
                </div>
            </div>
        )
    }
}

