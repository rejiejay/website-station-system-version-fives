import CONST from './const.js';

class MindSelectPopupComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="drop-down-select-component flex-center"
                id={`tippy${componentReferId}`}
                onClick={this.initSelectTooltip.bind(this)}
            >{children ? children : name}</div>
        )
    }
}

const mindSelectPopup = ({ }) => {
    /** 目标: 防止重复调用 */
    if (document.getElementById(CONST.ID)) return false;

    const node = document.createElement("div");

    node.setAttribute('class', CONST.ID);
    node.setAttribute('id', CONST.ID);
    document.body.appendChild(node);

    ReactDOM.render(<MindSelectPopupComponent />, document.getElementById(CONST.ID));
}

const mindSelectPopupDestroy = () => {
    const popup = document.getElementById(CONST.ID)
    if (popup) document.body.removeChild(popup)
}
