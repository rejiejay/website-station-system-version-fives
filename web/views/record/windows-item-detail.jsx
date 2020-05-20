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
        const { children } = this.props

        return (
            <div>
                {children}
            </div>
        )
    }
}
