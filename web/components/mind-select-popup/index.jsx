import CONST from './const.js';

class MindSelectPopupComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFullScreen: false
        }

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
    }

    componentDidMount() {
    }

    switchFullScreen() {
        this.setState({ isFullScreen: true })
    }

    renderContainerStyle() {
        const { isFullScreen } = this.state
        const { clientHeight } = this

        if (isFullScreen) return { height: `${clientHeight}px` }
        return { maxHeight: `${Math.floor(clientHeight / 2)}px` }
    }

    render() {
        const { title, handle } = this.props
        const { isFullScreen } = this.state

        return [
            <div className="popup-mask"></div>,
            <div className="popup-container" style={this.renderContainerStyle.call(this)}>
                {!isFullScreen && <div className="popup-container-title flex-start">
                    <div className="flex-rest flex-center">{title ? title : '请选择'}</div>
                    <div className="full-screen-icon flex-center"
                        onClick={this.switchFullScreen.bind(this)}
                    >
                        <svg width="18" height="18" t="1594544021084" class="icon" viewBox="0 0 1027 1024" version="1.1">
                            <path fill="#606266" d="M733.549304 0l116.434359 116.23452-226.402521 226.40252 57.053835 57.068109 226.459617-226.445342 120.616689 120.41685V0H733.549304zM689.513507 619.855586l-57.068108 57.068109 224.232847 224.232847-122.64362 122.843458h293.676657V729.838022l-114.007751 114.207588-224.190025-224.190024zM338.197775 404.144414l57.068109-57.068109L171.033037 122.843458 293.676657 0H0v294.161978l114.022025-114.207588 224.17575 224.190024zM347.076305 624.294851L120.616689 850.754468 0 730.323343v293.676657h294.161978l-116.420084-116.23452 226.40252-226.40252-57.068109-57.068109z"></path>
                        </svg>
                    </div>
                </div>}
            </div>
        ]
    }
}

export const mindSelectPopup = ({ title, handle }) => {
    /** 目标: 防止重复调用 */
    if (document.getElementById(CONST.ID)) return false;

    const node = document.createElement("div");

    node.setAttribute('class', CONST.ID);
    node.setAttribute('id', CONST.ID);
    document.body.appendChild(node);

    ReactDOM.render(<MindSelectPopupComponent
        title={title}
        handle={handle}
    />, document.getElementById(CONST.ID));
}

export const mindSelectPopupDestroy = () => {
    const popup = document.getElementById(CONST.ID)
    if (popup) document.body.removeChild(popup)
}
