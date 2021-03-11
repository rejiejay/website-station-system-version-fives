export default class ListOperation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { leftButtonFun, leftButtonDes, rightOperation, isAbsolute } = this.props
        const style = { position: isAbsolute ? 'absolute' : 'fixed' }

        return <div className="task-operation flex-start-center" style={style}>
            {!!leftButtonFun && !!leftButtonDes &&
                <div className="list-operation-left"
                    onClick={leftButtonFun}
                >{leftButtonDes}</div>
            }
            <div className="list-operation-rest flex-rest" />
            <div className="list-operation-right flex-start-center">{rightOperation.map((operation, key) =>
                <div className="operation-right-button flex-rest" key={key}
                    onClick={operation.fun}
                >{operation.name}</div>
            )}</div>
        </div>
    }
}
