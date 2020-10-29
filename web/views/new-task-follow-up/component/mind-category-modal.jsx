class Utils extends React.Component {
    constructor(props) {
        super(props)
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
        this.setState({ selectNodeId: null, expandNodeList: [] })
    }

    expandNodeHandle() {
        const { selectNodeId } = this.state
        if (!selectNodeId || selectNodeId === 1) return false /** 无法展开根目录 */

        const currentNode = this.mindData.data.find(element => +element.id === selectNodeId);

        const depthList = []
        const findParent = node => {
            depthList.push(node.id)

            if (node.parentid !== 1) {
                const parentNode = self.mindData.data.find(element => +element.id === node.parentid);
                findParent(parentNode)
            }
        }
        findParent(currentNode)

        this.collapseAllHandle()
        const expandNodeList = depthList.reverse()

        expandNodeList.forEach(id => this.mindInstan.expand_node(id))
        this.setState({ expandNodeList })
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

    baseMind = { meta: { name: "jsMind", author: "hizzgdev@163.com", version: "0.4.6" }, format: "node_array" }

    initTimeCategoryMind = (data, count) => [
        { id: 1, isroot: true, topic: `所有(${count.all})` },
        { id: 2, parentid: 1, topic: `今天(${count.today})`, expanded: false, direction: "right" },
        { id: 3, parentid: 1, topic: `3天(${count.recently})`, expanded: false, direction: "right" },
        { id: 4, parentid: 1, topic: `这周(${count.week})`, expanded: false, direction: "right" },
        { id: 5, parentid: 1, topic: `这月(${count.month})`, expanded: false, direction: "right" },
        { id: 6, parentid: 1, topic: `今年(${count.year})`, expanded: false, direction: "right" },
        ...data
    ]

    // 这里的数据仅仅只加载第一层、不要加载所有数据、等到需要展开的时候再将数据加载进来、
    initGroupCategoryMind = (data, count) => [
        { id: 1, isroot: true, topic: `所有(${count.all})` },
        { id: 2, parentid: 1, topic: `未分类 (${count.uncategorized})`, expanded: false, direction: "right" },
        ...data
    ]

    buttonFilter(button) {
        const { expandNodeList, selectNodeId } = this.state
        const isNeed = false

        if (button.key === 'add') isNeed = true
        if (button.key === 'put-off-date-select') isNeed = true
        if (['edit', 'move'].includes(button.key) && selectNodeId !== null && ![1, 2, 3, 4, 5, 6].includes(selectNodeId)) isNeed = true
        if (button.key === 'expand' && selectNodeId !== null && selectNodeId !== 1) isNeed = true
        if (button.key === 'back-all-list' && expandNodeList.length === 0) isNeed = true
        if (button.key === 'close-all-mind' && expandNodeList.length > 0) isNeed = true
        if (button.key === 'show-in-list' && expandNodeList.length > 0) isNeed = true
        if (button.key === 'time-contain-today' && expandNodeList.length > 0 && [3, 4, 5, 6].includes(expandNodeList[0])) isNeed = true

        return isNeed
    }

    putOffButtonDes() {
        const { putOffDateSelect } = this.state
        if (!putOffDateSelect) return 'select put off filter'
        return '3天? ...'
    }

    onItemClickHandle(node) {
        const { selectNodeId, isMoveNode } = this.state
        const id = +node.id

        if (isMoveNode) return this.moveNodeHandle(id)

        this.colorRestoration()
        this.setNodeColor({ id, bgcolor: '#f1c40f' })
        if (selectNodeId === id) return this.setState({ selectNodeId: null })
        this.setState({ selectNodeId })
    }
}

const CONST = {
    mind_category_type: {
        default: 'time',
        time: 'time',
        group: 'group'
    },

    task: {
        id: 1,
        nodeId: 1, // 节点标示, 因为数据库id会与mind标示冲突
        parentId: 1, // parentid = 1 表示 isroot
        title: '',
        content: '',
        /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */
        SMART: '',
        timestamp: 1590495644334,
        putoff: 1590495644334
    }
}

class MindCategoryModalLayout extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectNodeId: null,
            expandNodeList: [],
            isContainToday: false,
            putOffDateSelect: 1603698710646,
            isMoveNode: false
        }
    }

    async initMind() {
        const self = this
        const { jsmind_container } = this

        this.data = await this.fetchGetData()

        document.getElementById(jsmind_container).innerHTML = ''
        this.mindInstan = new jsMind({ container: jsmind_container, editable: true, theme: 'primary' })
        this.mindInstan.show({ ...baseMind, data: this.data })
        this.mindInstan.add_event_listener((type, { evt, node }) => {
            if (type === 4 && evt === 'select_node') {
                const data = self.mindInstan.get_node(node)
                self.onItemClickHandle(data)
            }
        })
    }

    render() {
        const { visible } = this.state
        const { jsmind_container } = this
        const { Modal } = this.props.children

        return <Modal
            visible={visible}
            isFullScreen={true}
            modalName='mind-category-select-modal'
        >{[
            <div className="mind-category">
                <div className="mind" id={jsmind_container}></div>
            </div>,

            this.operationRender()
        ]}</Modal>
    }
}

export class TimeCategory extends MindCategoryModalLayout {
    jsmind_container = 'time-category-jsmind'

    async fetchGetData() {
        const { isContainToday } = this.state
        const today = await fetch.getTask({ putOff: 'today' })
        const recently = await fetch.getTask({ isContainToday, putOff: 'recently' })
        const week = await fetch.getTask({ isContainToday, putOff: 'week' })
        const month = await fetch.getTask({ isContainToday, putOff: 'month' })
        const year = await fetch.getTask({ isContainToday, putOff: 'year' })

        const count = {
            today: today.length,
            recently: recently.length,
            week: week.length,
            month: month.length,
            year: year.length
        }

        const data = [
            ...today.map(task => ({ ...task, parentid: 2 })),
            ...recently.map(task => ({ ...task, parentid: 3 })),
            ...week.map(task => ({ ...task, parentid: 4 })),
            ...month.map(task => ({ ...task, parentid: 5 })),
            ...year.map(task => ({ ...task, parentid: 6 }))
        ]

        return this.initTimeCategoryMind(data, count)
    }

    operationRender() {
        const { isContainToday, isMoveNode } = this.state

        return <OperationBarFixedBottom
            leftButtonArray={[
                {
                    key: 'back-all-list',
                    description: 'back all list',
                    fun: () => { }
                }, {
                    key: 'close-all-mind',
                    description: 'close all mind',
                    fun: this.collapseAllHandle.bind(this)
                }
            ].filter(this.buttonFilter.bind(this))}
            rightButtonArray={[
                {
                    key: 'move',
                    description: isMoveNode ? 'Moving' : 'to Move',
                    fun: this.switchMoveNode.bind(this)
                }, {
                    key: 'expand',
                    description: 'expand',
                    fun: this.expandNodeHandle.bind(this)
                }, {
                    key: 'edit',
                    description: 'edit',
                    fun: () => { }
                }, {
                    key: 'time-contain-today',
                    description: isContainToday ? 'to filter today' : 'to show contain today',
                    fun: this.switchContainToday.bind(this)
                }, {
                    key: 'show-in-list',
                    description: 'show-in-list',
                    fun: () => { }
                }, {
                    key: 'add',
                    description: 'add',
                    fun: () => { }
                }
            ].filter(this.buttonFilter.bind(this))}
        />
    }
}

export class GroupCategory extends MindCategoryModalLayout {
    jsmind_container = 'group-category-jsmind'

    async fetchGetData() {
        const { putOffDateSelect } = this.state

        const uncategorizedCount = await fetch.getUncategorizedTaskCount({ putOff: putOffDateSelect })
        const all = await fetch.getTask({ putOff: putOffDateSelect })

        const count = {
            all: all.length,
            uncategorized: uncategorizedCount
        }

        return this.initGroupCategoryMind(all, count)
    }

    operationRender() {
        const { isMoveNode } = this.state

        return <OperationBarFixedBottom
            leftButtonArray={[
                {
                    key: 'back-all-list',
                    description: 'back all list',
                    fun: () => { }
                }, {
                    key: 'close-all-mind',
                    description: 'close all mind',
                    fun: this.collapseAllHandle.bind(this)
                }
            ].filter(this.buttonFilter.bind(this))}
            rightButtonArray={[
                {
                    key: 'move',
                    description: isMoveNode ? 'Moving' : 'to Move',
                    fun: this.switchMoveNode.bind(this)
                }, {
                    key: 'expand',
                    description: 'expand',
                    fun: this.expandNodeHandle.bind(this)
                }, {
                    key: 'edit',
                    description: 'edit',
                    fun: () => { }
                }, {
                    key: 'put-off-date-select',
                    description: this.putOffButtonDes.call(this),
                    fun: () => { }
                }, {
                    key: 'show-in-list',
                    description: 'show-in-list',
                    fun: () => { }
                }, {
                    key: 'add',
                    description: 'add',
                    fun: () => { }
                }
            ].filter(this.buttonFilter.bind(this))}
        />
    }
}

/**
 * 下面的是模拟服务端代码，因为我暂时是写不了这些代码的。所以盲写代码即可。
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 */

const getTask = ({ isContainToday, putOff }) => {
    const timestamp = {
        min: null,
        max: null
    }
    if (isContainToday === false) timestamp.min = tomorrowTimestamp()
}
const getUncategorizedTaskCount = ({ putOff }) => { }

const fetch = {
    getTask,
    getUncategorizedTaskCount
}
