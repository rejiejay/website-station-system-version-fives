import login from './../../components/login.js';

import CONST from './const.js';

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
            <div className="windows-header"></div>
        ]
    }
}
