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
    }

    renderContainerStyle() {
        const { isFullScreen } = this.state
        const { clientHeight } = this

        if (isFullScreen) return { height: `${clientHeight}px` }
        return { maxHeight: `${Math.floor(clientHeight / 2)}px` }
    }

    render() {
        const { title, handle } = this.props

        return [
            <div className="popup-mask"></div>,
            <div className="popup-container" style={this.renderContainerStyle.call(this)}>
                <div className="popup-container-title flex-start">
                    <div className="flex-rest flex-center">{title ? title : '请选择'}</div>
                    <div className="full-screen-icon">
                        
                    </div>
                </div>
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
