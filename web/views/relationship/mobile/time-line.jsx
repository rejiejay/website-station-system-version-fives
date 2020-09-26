const CONST = {
    TIME_LINE: {
        DEFAULT: [],
        FORMAT: {
            interval: 'step of distinguish for this relationship',
            startTimestamp: 'for range child',
            child: [
                CONST.TIME_LINE_ITEM.FORMAT
            ]
        }
    },

    TIME_LINE_ITEM: {
        DEFAULT: null,
        FORMAT: {
            id: 'for sql handle',
            title: 'item title line to timeline for follow up',
            situation: 'situation for clue',
            clusion: 'clusion for content',
            target: 'target for situation',
            action: 'action for record',
            result: 'result for record'
        }
    },

    DETAIL_PAGE_STATUS: {
        DEFAULT: 'hiden',
        ADD: 'add',
        EDIT: 'eidt',
        HIDEN: 'hiden'
    }
}

export default class TimeLineLayout extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: CONST.TIME_LINE.DEFAULT
        }

        this.timeLineDetailRef = React.createRef()
        this.intervalAdjustmentRef = React.createRef()
    }

    componentDidMount() {
        this.getTimeLine()
    }

    async getTimeLine() {
        const personId = getPersonId()
        const fetchtInstance = await fetch.get('getTimeLine', personId)
        if (fetchtInstance.result !== 1) return reGetConfirm(fetchtInstance.message)
        this.setState({ data: fetchtInstance.dada })
    }

    addTimeLineItemHandle(defaultTimestamp) { }

    editTimeLineItemHandle(timeLineId) { }

    delTimeLineItemHandle(timeLineId) { }

    delPersonHandle() { }

    render() {
        const self = this
        const { data } = this.state

        if (data.length <= 0) return [
            <DelPersonButton click={this.delPersonHandle} />,
            <AddTimeLineButton click={this.addTimeLineItemHandle} />
        ]

        return [
            data.map((interval, key) =>
                <Interval key={key}
                    data={interval}
                    addItem={self.addTimeLineItemHandle}
                    editItem={self.editTimeLineItemHandle}
                    delItem={self.delTimeLineItemHandle}
                ></Interval>
            ),

            <EditIntervalButton
                click={() => self.intervalAdjustmentRef.show()}
            />,

            <AddTimeLineButton click={this.addTimeLineItemHandle} />,

            <TimeLineDetail ref={this.timeLineDetailRef}
                original={data}
                callback={this.getTimeLine}
            />,

            <IntervalAdjustment ref={this.intervalAdjustmentRef}
                original={data}
                callback={this.getTimeLine}
            />
        ]
    }
}

const AddTimeLineButton = () => {
    return <></>
}

const EditIntervalButton = () => {
    return <></>
}

const DelPersonButton = () => {
    return <></>
}

const Interval = ({ data, addItem, editItem, delItem }) => <div>
    <div className="interval-title">{data.interval}</div>
    <div className="time-line">
        {data.child.map((timeline, key) =>
            <div className="time-line-item" key={key}
                onClick={() => editItem(timeline.id)}
            >
                <div className="time-line-description">{timeline.title}</div>
                <div className="time-line-del"
                    onClick={() => delItem(timeline.id)}
                >del</div>
            </div>
        )}
        <div className="time-line-item" key='add'>
            <div className="time-line-del"
                onClick={() => addItem(Math.floor((data.maxTimestamp + minTimestamp) / 2))}
            >add</div>
        </div>
    </div>
</div>

class TimeLineDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: CONST.TIME_LINE_ITEM.DEFAULT,
            pageStatus: CONST.DETAIL_PAGE_STATUS.DEFAULT
        }
    }

    show({ data, pageStatus }) {
        this.setState({ data, pageStatus })
    }

    inputItemComponent({ key, data, isOneLine, isRequired, placeholderTip }) {
        return <></>
    }

    render() {
        const { data, pageStatus } = this.state
        const InputItem = this.inputItemComponent

        if (!data || pageStatus === 'hiden') return ''

        return <>
            <InputItem key="title"
                data={data.title}
                isOneLine
                isRequired
                placeholderTip='title'
            />
            <InputItem key="clusion"
                data={data.clusion}
                isRequired
                placeholderTip='clusion'
            />
            <InputItem key="situation"
                data={data.situation}
                placeholderTip='situation'
            />
            <InputItem key="target"
                data={data.target}
                placeholderTip='target'
            />
            <InputItem key="action"
                data={data.action}
                placeholderTip='action'
            />
            <InputItem key="result"
                data={data.result}
                placeholderTip='result'
            />

            {pageStatus === 'add' && <div>add btn</div>}
            {pageStatus === 'eidt' && <div>eidt btn</div>}
        </>
    }
}

class IntervalAdjustment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: CONST.TIME_LINE.DEFAULT,
            isShow: false
        }
    }

    show(data) {
        this.setState({ data, isShow: true, isAddFirst, isAddLast })
    }

    addIntervalBtnComponent({ self, index, isAddLast }) {
        const { data } = self.state
        const thisData = data[index]

        const addHandle = title => {
            let submitData = _.cloneDeep(data)

            const targetItem = { interval: title }
            const thisTimestamp = thisData.startTimestamp
            if (isAddFirst) {
                targetItem.startTimestamp = thisTimestamp - oneDayTimestamp
                submitData = [targetItem, ...data]
            } else if (isAddLast) {
                targetItem.startTimestamp = thisTimestamp + oneDayTimestamp
                submitData = [...data, targetItem]
            } else {
                const lastTimestamp = data[index - 1].startTimestamp
                targetItem.startTimestamp = Math.floor((lastTimestamp + thisTimestamp) / 2)
                submitData.splice(index, 0, targetItem)
            }

            self.setState({ data: submitData })
        }

        return <></>
    }

    editIntervalTimeComponent({ self, index }) {
        return <></>
    }

    render() {
        const self = this
        const { data, isShow } = this.state
        const AddIntervalBtn = this.addIntervalBtnComponent
        const EditIntervalTime = this.editIntervalTimeComponent

        if (!data || !isShow) return ''

        return [
            data.map((item, key) => [
                <AddIntervalBtn key={`AddIntervalBtn-${key}`} index={key} self={self} />,
                <EditIntervalTime data={item.minTimestamp} key={`minTimestamp-${key}`} index={key} self={self} />,
                <div className="interval-container" key={`interval-${key}`}>
                    <div className="interval-container-name">{item.interval}</div>
                    <div className="interval-container-den">del interval btn</div>
                </div>,
                isLastData(key) && [
                    <AddIntervalBtn key={`AddIntervalBtn-last-${key}`} index={key} self={self} isAddLast />
                ]
            ]),

            isDataChange() && <div>save eidt button</div>,
            <div>Cancel button</div>,
        ]
    }
}
