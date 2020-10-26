const CONST = {
    botton_array: [{
        description: '',
        fun: () => { },
        style: {}
    }]
}

export default class OperationBarFixedBottom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { leftButtonArray, rightButtonArray } = this.props

        return <div className="operation-bar-fixed-bottom flex-start-center" style={style.main}>
            {leftButtonArray.map((button, key) =>
                <div className="flex-center" key={key}
                    style={style.leftItem}
                    onClick={button.fun}
                >{button.description}</div>)
            }

            <div className="flex-rest" />

            <div className="operation-right flex-start-center">{rightButtonArray.map((button, key) =>
                <div className="flex-center" key={key}
                    style={style.rightItem}
                    onClick={button.fun}
                >{button.description}</div>)
            }</div>
        </div>
    }
}

const style = {
    main: {
        position: 'fixed',
        bottom: '0px',
        left: '0px',
        height: '45px',
        width: '100%',
        borderTop: '1px solid #ddd',
        background: '#fff',
        fontSize: '12px'
    },

    leftItem: {
        padding: '0px 7.5px',
        height: '25px',
        borderRight: '1px solid #ddd',
    },

    rightItem: {
        padding: '0px 7.5px',
        height: '25px',
        borderLeft: '1px solid #ddd',
    }
}
