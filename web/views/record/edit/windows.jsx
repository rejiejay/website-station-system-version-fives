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

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            content: '',
            tag: null,
            type: CONST.DATA_TYPE.RECORD.value,
            images: '',

            isShowTagsSelected: false,
            tags: []
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

        const { title, content, tag, type, images, timestamp } = this.state
        const data = this.data

        let isDiff = false
        if (title !== data.title) isDiff = true
        if (content !== data.content) isDiff = true
        if (tag !== data.tag) isDiff = true
        if (type !== data.type) isDiff = true
        if (images !== data.images) isDiff = true
        if (timestamp !== data.timestamp) isDiff = true
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
        const { title, content, tag, type, images, timestamp } = this.state
        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        let body = { title, content, tag, type, images }
        if (timestamp) body.timestamp = timestamp

        fetch.post({
            url: 'record/add',
            body
        }).then(
            res => window.location.replace(`./../index.html${callbackUrl}`),
            error => { }
        )
    }

    editHandle() {
        const self = this
        const { id } = this
        const { title, content, tag, type, images, timestamp } = this.state
        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        fetch.post({
            url: 'record/edit',
            body: { id, title, content, tag, type, images, timestamp }
        }).then(
            ({ data }) => {
                toast.show('编辑成功')
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
        let placeholder = '详细描述与记录是什么'
        let onChangeHandle = ({ target: { value } }) => this.setState({ content: value })

        if (type === RECORD_CONST.DATA_TYPE.DIARY.value) {
            value = self.getJsonByDataType().clusion
            placeholder = '得出什么结论'
            onChangeHandle = ({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'clusion', value })
        }

        return (
            <textarea className="content-textarea fiex-rest" type="text"
                placeholder={placeholder}
                style={{ height: clientHeight - 215 }}
                value={value}
                onChange={onChangeHandle}
            ></textarea>
        )
    }

    delHandle() {
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

    uploadFileHandle({ target: { files } }) {
        const self = this
        let { images } = this.state
        let { file, cossdk, resource } = this
        const imageArray = server.getImageArray({ imageArrayString: images })

        const nowTimestamp = new Date().getTime()
        const path = `${resource}/${nowTimestamp}.png`

        file = files[0]

        if (!file) return toast.show('不存在文件');
        if (!cossdk) return toast.show('未初始化SDK');

        const uploadHandle = Body => cossdk.putObject({
            Bucket: 'rejiejay-1251940173',
            Region: 'ap-guangzhou',
            Key: path,
            Body
        }, function (err, data) {
            if (err) return toast.show(err);
            self.refs.file.value = null
            self.file = null
            imageArray.push(path)
            self.setState({ images: JSON.stringify(imageArray) })
        })

        /**
         * 含义: 压缩图片
         */
        lrz(file).then(
            ({ base64 }) => uploadHandle(homeServer.base64toFile({ base64, filename: `${nowTimestamp}.png` }))
        ).catch(
            err => toast.show('压缩图片失败')
        )
    }

    delImageHandle(key) {
        const self = this
        let { images } = this.state
        const imageArray = server.getImageArray({ imageArrayString: images })
        const image = imageArray[key]

        const handle = () => fetch.post({
            url: 'record/image/delete',
            body: { path: image }
        }).then(
            res => self.setState({ images: JSON.stringify(arrayRemoveItemByValue(imageArray, image)) }),
            error => { }
        )

        confirmPopUp({
            title: '你确定要删除这张图片吗?',
            succeedHandle: handle
        })
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

    render() {
        const self = this
        const { title, type, tag, tags, isShowTagsSelected, images, timestamp } = this.state
        const { clientHeight, status } = this
        const minHeight = clientHeight - 125
        const imageArray = server.getImageArray({ imageArrayString: images })

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
                            {self.renderContent.call(this)}
                        </div>
                    </div>

                    <div className="windows-separation"></div>

                    <div className="windows-container-right flex-rest">
                        <div className="soft-operate flex-start">

                            <div className="soft-operate-item flex-center flex-rest"
                                onClick={() => self.setState({ isShowTagsSelected: true })}
                            >{tag ? tag : '标签选择'}</div>

                            <input className="image-input"
                                style={{ display: 'none' }}
                                ref='file'
                                type="file"
                                name="file"
                                onChange={this.uploadFileHandle.bind(this)}
                            />
                            <div className="soft-operate-item flex-center flex-rest"
                                onClick={() => self.refs.file.click()}
                            >图片选择</div>
                            <div className="soft-operate-item flex-center flex-rest" >
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
                        </div>

                        {isShowTagsSelected && <div className="tag-selected">
                            <div className="tag-selected-title">标签选择</div>
                            <div className="tag-selected-container">
                                {tags.map((item, key) => (
                                    item ? <div className="tag-selected-item" key={key}>
                                        <div className="tag-item-container flex-center"
                                            onClick={() => self.setState({ tag: item, isShowTagsSelected: false })}
                                        >{item}</div>
                                    </div> : ''
                                ))}
                            </div>
                        </div>}

                        {imageArray.length > 0 && <div className="list-image">
                            <div className="list-image-title">图片列表</div>
                            <div className="list-image-container">
                                {imageArray.map((image, key) => (
                                    <div className="list-image-item" key={key}>
                                        <div className="image-item-container flex-center"
                                            onClick={() => self.delImageHandle(key)}
                                        >
                                            <img alt="image" src={`${BASE_CONST.TENCENT_OSS_RESOURCE}/${image}`} ></img>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}

                        <div className="other-input">
                            {type === RECORD_CONST.DATA_TYPE.DIARY.value && [
                                <div className="content-input">
                                    <div className="content-input-title">情况是什么</div>
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="情况是什么"
                                        style={{ height: '125px' }}
                                        value={self.getJsonByDataType().situation}
                                        onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'situation', value })}
                                    ></textarea>
                                </div>,
                                <div className="content-input">
                                    <div className="content-input-title">当时目标想法是什么</div>
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="当时目标想法是什么"
                                        style={{ height: '125px' }}
                                        value={self.getJsonByDataType().target}
                                        onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'target', value })}
                                    ></textarea>
                                </div>,
                                <div className="content-input">
                                    <div className="content-input-title">有啥行动</div>
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="有啥行动"
                                        style={{ height: '125px' }}
                                        value={self.getJsonByDataType().action}
                                        onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'action', value })}
                                    ></textarea>
                                </div>,
                                <div className="content-input">
                                    <div className="content-input-title">结果如何</div>
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="结果如何"
                                        style={{ height: '125px' }}
                                        value={self.getJsonByDataType().result}
                                        onChange={({ target: { value } }) => self.changeValueByDataTypeHandle({ key: 'result', value })}
                                    ></textarea>
                                </div>
                            ]}
                        </div>
                    </div>
                </div>

                <div className="windows-operate flex-start">
                    <div className="windows-operate-item flex-center flex-rest"
                        onClick={this.closeHandle.bind(this)}
                    >关闭</div>
                    {status === CONST.PAGE_STATUS.EDIT && self.verifyEditDiff() &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.editHandle.bind(this)}
                        >暂存</div>
                    }
                    {status === CONST.PAGE_STATUS.EDIT &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.delHandle.bind(this)}
                        >删除</div>
                    }
                    {status === CONST.PAGE_STATUS.ADD &&
                        <div className="windows-operate-item flex-center flex-rest"
                            onClick={this.addHandle.bind(this)}
                        >新增</div>
                    }
                </div>
            </div>
        )
    }
}
