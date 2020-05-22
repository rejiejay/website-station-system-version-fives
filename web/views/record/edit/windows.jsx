import fetch from './../../../components/async-fetch/fetch.js';
import { dropDownSelectPopup } from './../../../components/drop-down-select-popup.js';
import toast from './../../../components/toast.js'
import constHandle from './../../../utils/const-handle.js';
import { queryToUrl, loadPageVar, parseQueryString } from './../../../utils/url-handle.js';

import CONST from './const.js';
import WINDOWS_CONST from './../const.js';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            content: '',
            tag: null,
            type: CONST.DATA_TYPE.RECORD.value,
            images: ''
        }

        this.status = CONST.PAGE_STATUS.DEFAULTS
        this.callbackUrl = ''
        this.data = {}
        this.id = null

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        this.initCallbackPageVar()
        await this.initData()
    }

    initCallbackPageVar() {
        const callbackQuery = parseQueryString()

        let state = {}
        if (callbackQuery.tag) state.tag = callbackQuery.tag
        if (callbackQuery.type) state.type = callbackQuery.type
        this.setState(state)

        delete callbackQuery.id
        this.callbackUrl = queryToUrl(callbackQuery)
    }

    async initData() {
        const self = this
        const id = loadPageVar('id')
        this.id = id
        this.status = id ? CONST.PAGE_STATUS.EDIT : CONST.PAGE_STATUS.ADD

        if (!id) return

        await fetch.get({
            url: 'record/get/one',
            query: { id }
        }).then(
            ({ data }) => {
                self.data = data
                self.setState({
                    title: data.title,
                    content: data.content,
                    tag: data.tag,
                    type: data.type,
                    images: data.images
                })
            },
            error => { }
        )
    }

    verifyEditDiff() {
        const { status } = this
        if (status !== CONST.PAGE_STATUS.EDIT) return false

        const { title, content, tag, type, images } = this.state
        const data = this.data

        let isDiff = false
        if (title !== data.title) isDiff = true
        if (content !== data.content) isDiff = true
        if (tag !== data.tag) isDiff = true
        if (type !== data.type) isDiff = true
        if (images !== data.images) isDiff = true
        return isDiff
    }

    showDataTypeSelected() {
        const self = this

        dropDownSelectPopup({
            list: constHandle.toDownSelectFormat({
                CONST: CONST.DATA_TYPE,
                labelName: 'label',
                valueName: 'value'
            }),
            handle: ({ value, label }) => self.setState({ type: value }),
            mustSelect: false
        })
    }

    addHandle() {
        const { callbackUrl } = this
        const { title, content, tag, type, images } = this.state
        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        fetch.post({
            url: 'record/add',
            body: { title, content, tag, type, images }
        }).then(
            res => window.location.replace(`./../index.html${callbackUrl}`),
            error => { }
        )
    }

    render() {
        const self = this
        const { title, content, type } = this.state
        const { clientHeight, status } = this
        const minHeight = clientHeight - 75

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
                            <div className="data-type-selected"
                                onClick={this.showDataTypeSelected.bind(this)}
                            >{constHandle.findValueByValue({ CONST: CONST.DATA_TYPE, supportKey: 'value', supportValue: type, targetKey: 'label' })}</div>
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="详细描述与记录是什么"
                                style={{ height: minHeight - 63 - 32 }}
                                value={content}
                                onChange={({ target: { value } }) => this.setState({ content: value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="windows-separation"></div>

                    <div className="windows-container-right flex-rest">
                        <div className="soft-operate flex-start">
                            <div className="soft-operate-item flex-center flex-rest">关闭</div>
                            {status === CONST.PAGE_STATUS.EDIT && self.verifyEditDiff() &&
                                <div className="soft-operate-item flex-center flex-rest">暂存</div>
                            }
                            {status === CONST.PAGE_STATUS.ADD &&
                                <div className="soft-operate-item flex-center flex-rest"
                                    onClick={this.addHandle.bind(this)}
                                >新增</div>
                            }
                        </div>

                        <div className="tag-selected">
                        </div>

                        <div className="image-selected">
                        </div>

                        <div className="other-input">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
