export default class MindCategoryModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectNodeId: null,
            isContainToday: false,
            putOffDateSelect: 1603698710646,
            isMoveNode: false
        }

        this.mindCategoryType = 'time'
    }

    async initMind() {
        const self = this
        const { mindCategoryType } = this
        const { isContainToday, putOffDateSelect } = this.state
        this.data = await fetch.get(this.data, mindCategoryType, isContainToday, putOffDateSelect, initTimeMind, initCategoryMind)
        document.getElementById('jsmind_container').innerHTML = ''
        this.mindInstan = new jsMind({ container: 'jsmind_container', editable: true, theme: 'primary' })
        this.mindInstan.show({ ...baseMind, data: this.data })
        this.mindInstan.add_event_listener((type, { evt, node }) => {
            if (type === 4 && evt === 'select_node') {
                const { selectNodeId, isMoveNode } = self.state
                const data = self.mindInstan.get_node(node)
                if (isMoveNode) return self.moveNodeHandle(data.id)
                self.colorRestoration()
                self.setNodeColor({ id: +data.id, bgcolor: '#f1c40f' })
                if (selectNodeId === +data.id) return self.setState({ selectNodeId: null })
                self.setState({ selectNodeId: +data.id })
            }
        })
    }

    setNodeColor({ id, bgcolor }) {
        const fgcolor = '#FFF'
        this.mindInstan.set_node_color(id, bgcolor, fgcolor)
    }

    colorRestoration() {
        this.data.filter(element => +element.id !== 1).forEach(element => this.setNodeColor({ id: +element.id, bgcolor: '#428bca' }))
    }

    collapseAllHandle() {
        this.data.filter(element => ![1, 2, 3, 4, 5, 6].includes(+element.id)).map(element => this.mindInstan.collapse_node(+element.id))
        this.colorRestoration()
        self.setState({ selectNodeId: null })
    }

    switchShowPutOff() {
        const { putOffDateSelect } = this.state
        if (putOffDateSelect) return this.setState({ putOffDateSelect: null }, this.initMind)
        const myPutOffDateSelect = popoutSelect()
        this.setState({ putOffDateSelect: myPutOffDateSelect }, this.initMind)
    }

    switchContainToday() {
        const { isContainToday } = this.state
        this.setState({ isContainToday: !isContainToday }, this.initMind)
    }

    switchMoveNode() {
        const { isMoveNode } = this.state
        this.setState({ isMoveNode: !isMoveNode })
    }

    async moveNodeHandle(selectNodeId) {
        const confirmInstance = await confirmModal()
        if (confirmInstance.result !== 1) return

        const fetchInstance = await fetch.post(selectNodeId)
        if (fetchInstance.result !== 1) return reGetConfirm(() => this.moveNodeHandle(selectNodeId))

        const { isMoveNode } = this.state
        this.setState({ isMoveNode: !isMoveNode })
        this.initMind()
    }

    render() {
        const { selectNodeId, visible, isContainToday, putOffDateSelect, isMoveNode } = this.state
        const { mindCategoryType } = this
        const { switchShow } = this.props
        const { Modal } = this.props.children

        return <Modal
            visible={visible}
            isFullScreen={true}
            modalName='mind-category-select-modal'
        >{[
            <div className="mind-category">
                <div className="mind" id="jsmind_container"></div>
            </div>,
            <Operation
                leftButton={[
                    { des: '收起所有', fun: this.collapseAllHandle.bind(this) },
                ].filter(item => utils.haveExpanded(selectNodeId, item))}
                rightButton={[
                    { des: utils.isShowPutOffDes(putOffDateSelect, '选择推迟', `取消推迟${utils.putOffDateToName(putOffDateSelect)}`), fun: this.switchShowPutOff.bind(this) },
                    { des: utils.isContainTodayDes(isContainToday, '包含今天', '不包含今天'), fun: this.switchContainToday.bind(this) },
                    { des: '编辑', fun: () => { } },
                    { des: utils.moveNodeDes(isMoveNode, '移动', '取消移动'), fun: this.switchMoveNode.bind(this) },
                    { des: utils.haveExpanded(selectNodeId, '展开', '收起'), fun: () => { } },
                    { des: '切换列表', fun: switchShow },
                    { des: utils.haveSelect(selectNodeId, '新增', '新增无分类'), fun: () => { } },
                ].filter(item => utils.filterSelect(selectNodeId, isMoveNode, mindCategoryType, item))}
            />
        ]}</Modal>
    }
}

const baseMind = { meta: { name: "jsMind", author: "hizzgdev@163.com", version: "0.4.6" }, format: "node_array" }
const initTimeMind = (data, count) => [
    { id: 1, isroot: true, topic: `所有(${count.all})` },
    { id: 2, parentid: 1, topic: `今天(${count.today})`, expanded: false, direction: "right" },
    { id: 3, parentid: 1, topic: `3天(${count.recently})`, expanded: false, direction: "right" },
    { id: 4, parentid: 1, topic: `这周(${count.week})`, expanded: false, direction: "right" },
    { id: 5, parentid: 1, topic: `这月(${count.month})`, expanded: false, direction: "right" },
    { id: 6, parentid: 1, topic: `今年(${count.year})`, expanded: false, direction: "right" },
    ...data
]

// 这里的数据仅仅只加载第一层、不要加载所有数据、等到需要展开的时候再将数据加载进来、
const initCategoryMind = (data, count) => [
    { id: 1, isroot: true, topic: `所有(${count.all})` },
    { id: 2, parentid: 1, topic: `未分类 (${count.uncategorized})`, expanded: false, direction: "right" },
    ...data
]
