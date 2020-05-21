import { dropDownSelectPopup } from './../../../components/drop-down-select-popup.js';
import constHandle from './../../../utils/const-handle.js';

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

        this.status = CONST.PAGE_EDIT_STATUS.DEFAULTS
        this.data = {}
        this.id = null

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() { }

    verifyEditDiff() {
        const { status } = this
        if (status !== CONST.PAGE_EDIT_STATUS.EDIT) return false

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

    render() {
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
                            {status === CONST.PAGE_EDIT_STATUS.EDIT && self.verifyEditDiff() &&
                                <div className="soft-operate-item flex-center flex-rest">暂存</div>
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
