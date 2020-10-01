export default class ListOperation extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    render() {
        const { leftButtonFun, leftButtonDes, rightOperation } = this.props

        return <div className="task-list-operation flex-start-center">
            {!!leftButtonFun && !!leftButtonDes && 
                <div className="list-operation-left"
                    onClick={leftButtonFun}
                >{leftButtonDes}</div>
            }
            <div className="list-operation-rest flex-rest" />
            <div className="list-operation-right">{rightOperation.map((operation, key) => 
                <div className="operation-right-button" key={key}
                    onClick={operation.fun}
                >{operation.name}</div>
            )}</div>
        </div>
    }
}
