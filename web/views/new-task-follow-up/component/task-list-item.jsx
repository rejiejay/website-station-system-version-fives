export default class TaskListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
    }

    render() {
        const { data } = this.props
        const { ListOperation } = this.props.children
        const { clientHeight } = this
        const style = { minHeight: `${clientHeight - 125}px` }

        return <ListItemContainer
            style={style}
            title={data.title}
        >
            <ListItemContent key="content" text={data.content} />
            <ListOperation
                isAbsolute
                rightOperation={[
                    { name: '编辑', fun: () => { } }
                ]}
            />
        </ListItemContainer>
    }
}

const ListItemContainer = ({ style, title, children }) => <div className="task-list-item list-item">
    <div className="task-item-container" style={style}>
        <div className="list-item-title">{title}</div>
        {children}
    </div>
</div>

const ListItemContent = ({ text }) => <div className="list-item-content" dangerouslySetInnerHTML={{ __html: !!text && typeof text === 'string' ? text.replace(/\n/g, "<br>") : '' }}></div>
