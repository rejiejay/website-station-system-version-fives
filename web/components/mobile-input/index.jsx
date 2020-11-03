import style from './style.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
    }

    renderRightTopDiv() {
        const { children } = this.props
        return ''
    }
}

export default class TaskDetailModal extends Utils {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { title, value, onChangeHandle, placeholder, isRequiredHighlight, isAutoHeight, height } = this.props

        return <div className="mobile-input">
            <div className="input-title flex-start">
                <div className="input-title flex-rest"
                    style={style.inputTitleStyle(isRequiredHighlight)}
                >{isRequiredHighlight && '*'}{title}</div>
                {this.renderRightTopDiv()}
            </div>
            <div className="input-area">
                <textarea type="text"
                    style={style.inputTextarea(height, isAutoHeight, value)}
                    value={value}
                    onChange={({ target: { value } }) => onChangeHandle(value)}
                    placeholder={placeholder}
                />
            </div>
        </div>
    }
}
