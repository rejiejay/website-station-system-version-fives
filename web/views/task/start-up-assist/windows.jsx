import CONST from './const.js'

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isEdit: false,
            content: CONST.START_UP_ASSIST.DEFAULT
        }
    }

    async componentDidMount() {
    }

    render() {
        const { content, isEdit } = this.state

        return <div class="windows flex-column-center">

            {isEdit && <textarea class="flex-rest" rows="12" cols="20"></textarea>}
            {!isEdit && <div className="windows-content flex-rest">
                {content.map((value, key) => [
                    <div className="windows-title" key={key}>{value.title}</div>,
                    value.item.map((item, id) => <div className="windows-item" key={id}>
                        <div className="item-container">· {item}</div>
                    </div>)
                ])}
            </div>}

            <div class="button">
                <div class="flex-start-center">
                    <span></span>
                    <button class="button-item flex-rest">暂存</button>
                    <span></span>
                    <button class="button-item flex-rest">查看JSON</button>
                    <span></span>
                    <button class="button-item flex-rest">格式化</button>
                    <span></span>
                    <button class="button-item flex-rest">恢复</button>
                    <span></span>
                </div>
            </div>
        </div>
    }
}

