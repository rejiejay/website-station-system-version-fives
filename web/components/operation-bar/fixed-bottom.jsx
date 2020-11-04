import style from './style.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
    }

    CONST = {
        botton_array: [{
            description: '',
            fun: () => { },
            style: {}
        }]
    }
}

export default class OperationBarFixedBottom extends Utils {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { leftButtonArray, rightButtonArray, isAbsolute } = this.props

        return <div className="operation-bar-fixed-bottom flex-start-center" style={style.main(isAbsolute)}>
            {leftButtonArray && leftButtonArray.map((button, key) =>
                <div className="flex-center" key={key}
                    style={style.leftItem}
                    onClick={button.fun}
                >{button.description}</div>)
            }

            <div className="flex-rest" />

            <div className="operation-right flex-start-center">{rightButtonArray && rightButtonArray.map((button, key) =>
                <div className="flex-center" key={key}
                    style={style.rightItem}
                    onClick={button.fun}
                >{button.description}</div>)
            }</div>
        </div>
    }
}
