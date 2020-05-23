import fetch from './../../../components/async-fetch/fetch.js';
import { dropDownSelectPopup } from './../../../components/drop-down-select-popup.js';
import toast from './../../../components/toast.js'
import { confirmPopUp } from './../../../components/confirm-popup.js';
import constHandle from './../../../utils/const-handle.js';
import jsonHandle from './../../../utils/json-handle.js';
import { queryToUrl, loadPageVar, parseQueryString } from './../../../utils/url-handle.js';

import CONST from './const.js';
import WINDOWS_CONST from './../const.js';
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
        this.resource = WINDOWS_CONST.IMAGES.TEMPORARY_RESOURCE

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

    changeValueByDataTypeHandle({ key, value }) {
        let { type, content } = this.state

        if (type === WINDOWS_CONST.DATA_TYPE.DIARY.value) {
            let diary = this.getJsonByDataType()
            diary[key] = value
            content = JSON.stringify(diary)
        }

        this.setState({ content })
    }

    getJsonByDataType() {
        const { type, content } = this.state
        if (type === WINDOWS_CONST.DATA_TYPE.DIARY.value) {
            const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: content })
            if (verifyJSONresult.isCorrect) {
                let diary = verifyJSONresult.data
                return diary
            } else {
                let diary = WINDOWS_CONST.DATA_FORMAT.diary
                diary.clusion = content
                return diary
            }
        }

        return content
    }

    renderContent() {
        const { clientHeight } = this
        const self = this
        const { type, content } = this.state

        let value = content
        let placeholder = '详细描述与记录是什么'
        let onChangeHandle = ({ target: { value } }) => this.setState({ content: value })

        if (type === WINDOWS_CONST.DATA_TYPE.DIARY.value) {
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

    getImageArray() {
        let { images } = this.state
        const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: images, isArray: true })
        if (!verifyJSONresult.isCorrect) return [];
        return verifyJSONresult.data
    }

    uploadFileHandle({ target: { files } }) {
        const self = this
        let { file, cossdk, resource } = this
        const images = this.getImageArray()

        const nowTimestamp = new Date().getTime()
        const path = `${resource}/${nowTimestamp}.png`

        file = files[0]

        if (!file) return toast.show('不存在文件');
        if (!cossdk) return toast.show('未初始化SDK');

        cossdk.putObject({
            Bucket: 'rejiejay-1251940173',
            Region: 'ap-guangzhou',
            Key: path,
            Body: file,
        }, function (err, data) {
            if (err) return toast.show(err);
            self.refs.file.value = null
            self.file = null
            images.push(path)
            self.setState({ images: JSON.stringify(images) })
        })
    }

    render() {
        const self = this
        const { title, type, tag, tags, isShowTagsSelected } = this.state
        const { clientHeight, status } = this
        const minHeight = clientHeight - 125

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
                        </div>

                        {isShowTagsSelected && <div className="tag-selected">
                            <div className="tag-selected-title">标签选择</div>
                            {tags.map((item, key) => (
                                item ? <div className="tag-selected-item" key={key}>
                                    <div className="tag-item-container flex-center"
                                        onClick={() => self.setState({ tag: item, isShowTagsSelected: false })}
                                    >{item}</div>
                                </div> : ''
                            ))}
                        </div>}

                        <div className="image-selected">
                        </div>

                        <div className="other-input">
                            {type === WINDOWS_CONST.DATA_TYPE.DIARY.value && [
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
