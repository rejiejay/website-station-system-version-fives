import { loadPageVar } from './../../../utils/url-handle.js';
import { confirmPopUp } from './../../../components/confirm-popup.js';
import timeTransformers from './../../../utils/time-transformers.js';

import CONST from './const.js';
import TASK_CONST from './../const.js';
import server from './../server.js';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            content: '',
            /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */
            SMART: '',
            /** 作用: 绑定结论 */
            link: '',
            putoff: null
        }

        this.status = CONST.PAGE_STATUS.DEFAULTS
        this.id = null
        this.data = TASK_CONST.TASK.DEFAULT_ITEM

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        tippy('[data-tippy-content]');
        this.initPageVar()
    }

    initPageVar() {
        const id = loadPageVar('id')
        this.id = id
        this.status = id ? CONST.PAGE_STATUS.EDIT : CONST.PAGE_STATUS.ADD
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
        const { status } = this
        if (status !== CONST.PAGE_EDIT_STATUS.EDIT) return false

        const { title, content, SMART, link, putoff } = this.state
        const data = this.data

        let isDiff = false
        if (title !== data.title) isDiff = true
        if (content !== data.content) isDiff = true
        if (SMART !== data.SMART) isDiff = true
        if (link !== data.link) isDiff = true
        if (putoff !== data.putoff) isDiff = true
        return isDiff
    }

    render() {
        const self = this
        const { title, content, SMART, putoff } = this.state
        const { clientHeight, status } = this
        const minHeight = clientHeight - 125
        const smart = server.getJsonDataBySMART(SMART)

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
                        <div className="windows-right-putoff"></div>
                        <div className="soft-operate flex-start">
                            <input readonly type="text"
                                id="picka-date"
                                style={{ display: 'none' }}
                                placeholder="时间?"
                            />
                            {!putoff && <div className="soft-operate-item flex-center flex-rest"
                                onClick={this.putoffHandle.bind(this)}
                            >推迟?</div>}
                            {putoff && <div className="soft-operate-item flex-center flex-rest"
                                onClick={this.clearPutoffHandle.bind(this)}
                            >取消推迟</div>}
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
                    <div className="windows-operate-item flex-center flex-rest"
                    >关闭</div>
                    {status === CONST.PAGE_STATUS.EDIT && self.verifyEditDiff() &&
                        <div className="windows-operate-item flex-center flex-rest"
                        >暂存</div>
                    }
                    {status === CONST.PAGE_STATUS.EDIT &&
                        <div className="windows-operate-item flex-center flex-rest"
                        >删除</div>
                    }
                    {status === CONST.PAGE_STATUS.ADD &&
                        <div className="windows-operate-item flex-center flex-rest"
                        >新增</div>
                    }
                </div>
            </div>
        )
    }
}

