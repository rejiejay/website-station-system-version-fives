import { createRandomStr } from './../../utils/string-handle.js'

import CONST from './const.js';

const props = {
    taskMindItem: CONST.MIND_FORMAT,
    children: {},
    className: 'list-left',
    taskMindHeight: '2/3px',
    onSelectNodeHandle: () => { }
}

export default class WindowsListItemComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isShowPutoff: true
        }

        this.jsMindContainerRefer = `jsmind_${createRandomStr({ length: 10 })}`
        this.jsMindInstance = null
    }

    componentDidMount() {
        this.initJsMind()
    }

    /**
     * 这里会出现数据异步问题,所以手动更新DOM
     */
    // componentDidUpdate(prevProps) {
    //     const { taskMindItem } = this.props

    //     const isJsMindChange = () => {
    //         if (!prevProps) return true /** 含义：之前连props都没有 */
    //         if (!prevProps.taskMindItem || !prevProps.taskMindItem.data || prevProps.taskMindItem.data.length <= 0) return true
    //         if (!taskMindItem || !taskMindItem.data || taskMindItem.data.length <= 0) return false
    //         if (JSON.stringify(prevProps.taskMindItem.data) === JSON.stringify(taskMindItem.data)) return false
    //         return true
    //     }

    //     if (isJsMindChange()) {
    //         this.initJsMind()
    //     }
    // }

    initJsMind() {
        const { jsMindContainerRefer } = this
        const { taskMindItem } = this.props

        if (!taskMindItem || !taskMindItem.data || taskMindItem.data.length <= 0) return false

        this.jsMindInstance = new jsMind({
            container: jsMindContainerRefer,
            editable: true,
            theme: CONST.MIND_THEME.PRIMARY
        })

        this.jsMindInstance.show(taskMindItem);
        this.initSelectHandle()
        this.setPutoffColor()
    }

    updateJsMind() {
        const { jsMindContainerRefer } = this

        document.getElementById(jsMindContainerRefer).innerHTML = ''
        this.initJsMind()
    }

    initSelectHandle() {
        const { onSelectNodeHandle } = this.props
        const self = this

        const selectNodeHandle = node => {
            const data = self.jsMindInstance.get_node(node)
            onSelectNodeHandle(data)
        }

        this.jsMindInstance.add_event_listener((type, { evt, node }) => {
            if (type === 4 && evt === 'select_node') selectNodeHandle(node)
        });
    }

    setPutoffColor() {
        const self = this
        const { taskMindItem } = this.props

        taskMindItem.data.filter(element => !!element.putoff).map(element => {
            const bgcolor = '#ff4d4f'
            const fgcolor = '#FFF'
            self.jsMindInstance.set_node_color(+element.id, bgcolor, fgcolor)
        })
    }

    render() {
        const { jsMindContainerRefer } = this
        const { children, className, taskMindHeight } = this.props

        return (
            <div className={className} style={{ height: taskMindHeight }} id={jsMindContainerRefer}>
                {children}
            </div>
        )
    }
}
