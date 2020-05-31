import { loadPageVar } from './../../../utils/url-handle.js';

import CONST from './const.js';

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

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        this.initPageVar()
    }

    initPageVar() {
        const id = loadPageVar('id')
        this.id = id
        this.status = id ? CONST.PAGE_STATUS.EDIT : CONST.PAGE_STATUS.ADD
    }

    render() {
        const self = this
        const { title, content } = this.state
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
                        <div className="soft-operate flex-start">

                            <div className="soft-operate-item flex-center flex-rest"
                            >a</div>
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

