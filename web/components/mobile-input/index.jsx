import style from './style.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
    }
}

export default class MobileInput extends Utils {
    constructor(props) {
        super(props)
    }

    render() {
        const { title, value, onChangeHandle, placeholder, isRequiredHighlight, isAutoHeight, height, isTheme, children } = this.props

        return <div className="mobile-input">
            <div className="input-title flex-start" style={style.inputTitleStyle(isRequiredHighlight)}>
                <div className="input-title flex-rest">{isRequiredHighlight && '*'}{title}</div>

                {children && children.rightTopDiv}

            </div>
            <div className="input-area flex-center" style={style.inputArea}>
                {isTheme &&
                    <input type="text"
                        style={style.inputTheme()}
                        value={value}
                        onChange={({ target: { value } }) => onChangeHandle(value)}
                        placeholder={placeholder}
                    />
                }
                {!isTheme &&
                    <textarea type="text"
                        style={style.inputTextarea(height, isAutoHeight, value)}
                        value={value}
                        onChange={({ target: { value } }) => onChangeHandle(value)}
                        placeholder={placeholder}
                    />
                }
            </div>
        </div>
    }
}
