import login from './../../../components/login.js';

export default class WindowsComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    async componentDidMount() {
        await login()
    }

    render() {
        return [
            <div>记录系统</div>
        ]
    }
}
