import CONST from './const.js'

export default class MobileComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            content: CONST.START_UP_ASSIST.DEFAULT
        }
    }

    async componentDidMount() {
    }

    render() {
        const { content } = this.state

        return <div className="mobile">
            {content.map((value, key) => [
                <div className="spiritual-title" key={key}>{value.title}</div>,
                value.item.map((item, id) => <div className="spiritual-item" key={id}>
                    <div className="item-container">{item}</div>
                </div>)
            ])}
        </div>
    }
}

