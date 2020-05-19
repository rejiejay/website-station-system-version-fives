import login from './../../components/login.js';

import CONST from './const.js';

export default class MobileComponent extends React.Component {
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

