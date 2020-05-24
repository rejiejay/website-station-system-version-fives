import fetch from './../../../components/async-fetch/fetch.js';
import { dropDownSelectPopup } from './../../../components/drop-down-select-popup.js';
import toast from './../../../components/toast.js'
import { confirmPopUp } from './../../../components/confirm-popup.js';
import constHandle from './../../../utils/const-handle.js';
import { queryToUrl, loadPageVar, parseQueryString } from './../../../utils/url-handle.js';
import { arrayRemoveItemByValue } from './../../../utils/array-handle.js';
import timeTransformers from './../../../utils/time-transformers.js';

import CONST from './const.js';
import RECORD_CONST from './../const.js';
import BASE_CONST from './../../const.js';
import server from './../server.js';
import homeServer from './../../server.js';

export default class MobileComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            content: '',
            tag: null,
            tags: [],
            type: CONST.DATA_TYPE.RECORD.value,
            timestamp: 0,
            images: ''
        }

        this.status = CONST.PAGE_STATUS.DEFAULTS
        this.callbackUrl = ''
        this.data = {}
        this.id = null

        this.cossdk = null
        this.file = null
        this.resource = RECORD_CONST.IMAGES.TEMPORARY_RESOURCE

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        this.initCallbackPageVar()
        this.initCosJsSdk()
        await this.initTag({})
        await this.initData()
    }

    initCallbackPageVar() {
        const callbackQuery = parseQueryString()

        let state = {}
        if (callbackQuery.tag) state.tag = callbackQuery.tag
        if (callbackQuery.type) state.type = +callbackQuery.type
        this.setState(state)

        delete callbackQuery.id
        this.callbackUrl = queryToUrl(callbackQuery)
    }

    initCosJsSdk() {
        const { resource } = this
        this.cossdk = homeServer.getImageAuthorization({ resource })
    }

    async initTag({ isForceRefresh }) {
        const tags = await server.getTags({ isForceRefresh })
        this.setState({ tags })
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
                    images: data.images,
                    timestamp: data.timestamp
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

    showTagsSelected() {
        const self = this
        const { tags } = this.state

        const handle = ({ value, label }) => {
            self.setState({ tag: value })
            const { sort, type, minTimestamp, maxTimestamp } = self.state
            let query = { sort, tag: value, type, minTimestamp, maxTimestamp }
            window.location.replace(`./index.html${queryToUrl(query)}`)
            toast.show()
        }

        dropDownSelectPopup({
            list: [{ label: '所有', value: '' }].concat(tags.map(tag => ({ label: tag, value: tag }))),
            handle,
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

    editHandle() {
        const self = this
        const { id } = this
        const { title, content, tag, type, images } = this.state
        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        fetch.post({
            url: 'record/edit',
            body: { id, title, content, tag, type, images }
        }).then(
            ({ data }) => {
                toast.show('编辑成功')
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

    deleteHandle() {
        const { id, callbackUrl } = this

        const handle = () => {
            fetch.post({
                url: 'record/del/id',
                body: { id }
            }).then(
                res => window.location.replace(`./../index.html${callbackUrl}`),
                error => { }
            )
        }

        confirmPopUp({
            title: '你确定要删除这条数据吗?',
            succeedHandle: handle
        })
    }

    closeHandle() {
        const { status, callbackUrl } = this

        const handleBack = () => window.location.replace(`./../index.html${callbackUrl}`)

        if (status === CONST.PAGE_STATUS.EDIT && this.verifyEditDiff()) {
            confirmPopUp({
                title: '你有数据尚未保存，你确定要返回吗?',
                succeedHandle: handleBack
            })
        }

        handleBack()
    }

    timeStampHandle() {
        const self = this
        const nowYear = new Date().getFullYear()
        const handle = data => self.setState({ timestamp: data })

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
        document.getElementById('picka-date').value = ''
        this.setState({ timestamp: null });
    }

    changeValueByDataTypeHandle({ key, value }) {
        let { type, content } = this.state

        if (type === RECORD_CONST.DATA_TYPE.DIARY.value) {
            let diary = this.getJsonByDataType()
            diary[key] = value
            content = JSON.stringify(diary)
        }

        this.setState({ content })
    }

    getJsonByDataType() {
        const { type, content } = this.state
        return server.getJsonByDataType({ type, content })
    }

    renderContent() {
        const { clientHeight } = this
        const self = this
        const { type, content } = this.state

        let value = content
        let height = clientHeight - 235
        let placeholder = '详细描述与记录是什么'
        let onChangeHandle = ({ target: { value } }) => this.setState({ content: value })

        if (type === RECORD_CONST.DATA_TYPE.DIARY.value) {
            value = self.getJsonByDataType().clusion
            height = 250
            placeholder = '得出什么结论'
            onChangeHandle = ({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'clusion', value })
        }

        return (
            <textarea className="content-textarea fiex-rest" type="text"
                placeholder={placeholder}
                style={{ height: height }}
                value={value}
                onChange={onChangeHandle}
            ></textarea>
        )
    }

    render() {
        const self = this
        const { title, type, tag, images, timestamp } = this.state
        const { status } = this
        const imageArray = server.getImageArray({ imageArrayString: images })

        return [
            <div class="mobile-edit">
                <div class="edit-title edit-required">*简单描述/提问/归纳:</div>
                <div class="edit-input flex-start-center">
                    <input type="text" placeholder="简单描述/提问"
                        value={title}
                        onChange={({ target: { value } }) => this.setState({ title: value })}
                    />
                </div>

                <div class="edit-title flex-start">
                    <div className="flex-rest">得出什么结论?</div>
                    <div className="data-type-selected"
                        onClick={this.showDataTypeSelected.bind(this)}
                    >数据类型: {constHandle.findValueByValue({ CONST: CONST.DATA_TYPE, supportKey: 'value', supportValue: type, targetKey: 'label' })}</div>
                </div>
                <div class="edit-input flex-start-center">
                    {this.renderContent.call(this)}
                </div>

                {type === RECORD_CONST.DATA_TYPE.DIARY.value && [
                    <div class="edit-title">情况是什么:</div>,
                    <div class="edit-input flex-start-center">
                        <textarea type="text" placeholder="情况是什么"
                            style={{ height: '125px' }}
                            value={self.getJsonByDataType().situation}
                            onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'situation', value })}
                        />
                    </div>,
                    <div class="edit-title">当时目标想法是什么:</div>,
                    <div class="edit-input flex-start-center">
                        <textarea type="text" placeholder="当时目标想法是什么"
                            style={{ height: '125px' }}
                            value={self.getJsonByDataType().target}
                            onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'target', value })}
                        />
                    </div>,
                    <div class="edit-title">有啥行动:</div>,
                    <div class="edit-input flex-start-center">
                        <textarea type="text" placeholder="有啥行动"
                            style={{ height: '125px' }}
                            value={self.getJsonByDataType().action}
                            onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'action', value })}
                        />
                    </div>,
                    <div class="edit-title">结果如何:</div>,
                    <div class="edit-input flex-start-center">
                        <textarea type="text" placeholder="结果如何"
                            style={{ height: '125px' }}
                            value={self.getJsonByDataType().result}
                            onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'result', value })}
                        />
                    </div>
                ]}

                <div class="edit-title">当时时间?</div>
                <div class="edit-input flex-start-center">
                    <input readonly type="text"
                        id="picka-date"
                        value={timestamp ? timeTransformers.dateToYYYYmmDDhhMM(new Date(+timestamp)) : ''}
                        placeholder="时间?"
                        onClick={this.timeStampHandle.bind(this)}
                    />
                    <div class="picka-clear flex-center"
                        onClick={this.timeStampClearHandle.bind(this)}
                    >取消</div>
                </div>

                <div className="select-tag">
                    <div className="select-tag-container flex-center"
                        onClick={this.showTagsSelected.bind(this)}
                    >{tag ? tag : '请选择标签'}</div>
                </div>
            </div>,

            <div class="mobile-operation">
                <div class="operation-container flex-start-center">
                    {status === CONST.PAGE_STATUS.ADD && [
                        <div class="vertical-line"></div>,
                        <div class="operation-button flex-center flex-rest"
                            onClick={this.addHandle.bind(this)}
                        >保存</div>
                    ]}
                    {status === CONST.PAGE_STATUS.EDIT && self.verifyEditDiff() && [
                        <div class="vertical-line"></div>,
                        <div class="operation-button flex-center flex-rest"
                            onClick={this.editHandle.bind(this)}
                        >暂存</div>
                    ]}
                    {status === CONST.PAGE_STATUS.EDIT && [
                        <div class="vertical-line"></div>,
                        <div class="operation-button flex-center flex-rest"
                            onClick={this.deleteHandle.bind(this)}
                        >删除</div>
                    ]}
                    <div class="vertical-line"></div>
                    <div class="operation-button flex-center flex-rest"
                        onClick={this.closeHandle.bind(this)}
                    >取消</div>
                </div>
            </div>,
        ]
    }
}
