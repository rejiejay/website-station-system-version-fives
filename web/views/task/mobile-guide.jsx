export default class MobileGuideComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isShow: false
        }

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    setShow() {
        this.setState({ isShow: true })
    }

    whatCanDo() {
        const { selectMindNodeHandle } = this.props
        this.setState(
            { isShow: false },
            selectMindNodeHandle
        )
    }

    createNewTask() {
        const { showNewActionSheet } = this.props
        this.setState(
            { isShow: false },
            showNewActionSheet
        )
    }

    render() {
        const { isShow } = this.state

        if (!isShow) return ''
        return (<div className="mobile-guide">
            <div className="mobile-guide-title flex-center">
                导航页
                <div className="guide-title-colse flex-center"
                    onClick={() => this.setState({ isShow: false })}
                >X</div>
            </div>

            <div className="mobile-guide-content">
                <div className="guide-content-container">
                    <div className="guide-content-item"
                        onClick={this.whatCanDo.bind(this)}
                    >有哪些可以做?</div>
                    <div className="guide-content-item"
                        onClick={() => window.location.href = './start-up-assist/index.html'}
                    >不想做怎么办?</div>
                    <div className="guide-content-item"
                        onClick={() => window.location.href = './../require/index.html'}
                    >计划是什么?进度到哪?何时能完成?</div>
                    <div className="guide-content-item"
                        onClick={() => window.location.href = './../record/index.html'}
                    >有哪些可以复习?</div>
                    <div className="guide-content-item"
                        onClick={this.createNewTask.bind(this)}
                    >创建新任务?</div>
                </div>
            </div>
        </div >)
    }
}

