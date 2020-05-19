import login from './../components/login.js';

import CONST from './const.js';

export default class MobileComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    async componentDidMount() {
        await login()
    }

    render() {

        return [
            <div className="flex-center"
                style={{ background: '#fff', height: '75px', borderBottom: '1px solid #ddd' }}
                onClick={() => window.location.href = './record/index.html'}
            >记录系统</div>,
            <div className="flex-center"
                style={{ background: '#fff', height: '75px', borderBottom: '1px solid #ddd' }}
                onClick={() => window.location.href = './task/index.html'}
            >任辅跟启效应系统</div>,
            <div className="flex-center"
                style={{ background: '#fff', height: '75px', borderBottom: '1px solid #ddd' }}
                onClick={() => window.location.href = './require/index.html'}
            >需求辅助分析</div>
        ]
    }
}

