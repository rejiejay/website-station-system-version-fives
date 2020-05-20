import CONST from './const.js';

export default class WindowsItemDetailComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        const { children, className, style } = this.props

        return (
            <div className={className}>
                <div className="content-detail-container " style={style}>

                    {/* 此处需要添加判断, 渲染哪种数据类型 */}
                    <div className="detail-preview">
                        {children.recordNode || children.diaryNode}
                    </div>

                    <div className="detail-operate">
                        {children.operateNode}
                    </div>
                </div>
            </div>
        )
    }
}
