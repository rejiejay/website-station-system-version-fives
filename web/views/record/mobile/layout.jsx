import uiStorage from './../../components/ui-storage/index';

export default class RecordMobileLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: CONST.DATA.DEFAULT_LIST,
            count: 0,

            search: CONST.DATA.DEFAULT_LIST,
            isSearch: false,
        }

        utils.initLayoutRef(this)
    }

    async componentDidMount() {
        await login()

        const { sortWay, tagsFilter, typeFilter } = this.listRef.current.getSortFilter() // [sort, tags, type] is Persistence
        this.operateBarRef.current.init({ sortWay, tagsFilter, typeFilter })

        await this.initListData()
    }

    async initListData() {
        const { list, count } = await this.listRef.current.getData() // must success
        this.setState({ list, count })
    }

    async loadMoreHandle() {
        const list = await this.listRef.current.getMore() // must success
        this.setState({ list })
    }

    async addHandle(type) {
        const { list } = this.state
        const itemInstance = await this.editModelRef.current.showAdd({ type })
        if (itemInstance.result !== 1) return // Cancel add
        const item = itemInstance.data
        this.setState({ list: [item, ...list] })
    }

    async editHandle(editItem) {
        let { list } = this.state
        const editInstance = await this.editModelRef.current.showEdit({ item: editItem })
        if (editInstance.result !== 1) return // Cancel edit
        const newEditItem = editInstance.data
        this.setState({ list: list.map(item => item.id === newEditItem.id ? newEditItem : item) })
    }

    async sortHandle(sortWay) {
        const list = await this.listRef.current.switchSortWay(sortWay) // must success && reload list && persistence
        this.setState({ list })
    }

    async tagsFilterHandle() {
        const tagsInstance = await this.tagsModelRef.current.show()
        if (tagsInstance.result !== 1) return // Cancel tags select
        const tags = tagsInstance.data
        this.operateBarRef.init({ tagsFilter: tags })
        const { list, count } = await this.listRef.current.filterTags(tags) // must success && reload list && persistence
        this.setState({ list, count })
    }

    async typeFilterHandle(dataType) {
        const { list, count } = await this.listRef.current.filterType(dataType) // must success && reload list && persistence
        this.setState({ list, count })
    }

    async onSearchChange({ target: { value } }) {
        if (!value) return this.setState({ isSearch: false, search: [] })

        const search = await this.listRef.current.getSearch(dataType) // must success
        this.setState({ isSearch: !!value, search })
    }

    async timeFilterHandle() {
        const timeInstance = await this.timeModelRef.current.show()
        if (timeInstance.result !== 1) return // Cancel time select
        const time = timeInstance.data
        this.operateBarRef.init({ timeFilter: time })
        const { list, count } = await this.listRef.current.filterTime(time) // must success && reload list && not need persistence
        this.setState({ list, count })
    }

    render() {
        const { listRef, operateBarRef, editModelRef, tagsModelRef, timeModelRef } = this
        let { list, search, isSearch } = this.state

        return [
            <List ref={listRef}
                data={list}
                isSearch={isSearch}
                search={search}
                edit={this.editHandle.bind(this)}
            >{{
                ListItemContainer,
                RrcordItem,
                DiaryItem
            }}</List>,
            <LoadMore
                isLoadAll={!isSearch && list.length >= count}
                clickHandle={this.loadMoreHandle.bind(this)}
            />,
            <OperateBar ref={operateBarRef}
                addHandle={this.addHandle.bind(this)}
                sortHandle={this.sortHandle.bind(this)}
                tagsFilterHandle={this.tagsFilterHandle.bind(this)}
                typeFilterHandle={this.typeFilterHandle.bind(this)}
                onSearchChange={this.onSearchChange.bind(this)}
                timeFilterHandle={this.timeFilterHandle.bind(this)}
            />,
            <EditModel ref={editModelRef} />,
            <TagsModel ref={tagsModelRef} />,
            <TimeModel ref={timeModelRef} />
        ]
    }
}

class OperateBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sortWay: CONST.SORT.DEFAULT.value,
            tagsFilter: [],
            typeFilter: CONST.DATA_TYPE.DEFAULT.value,
            searchValue: '',
            minTimestamp: null,
            maxTimestamp: null,
        }
    }

    init(sortFilter) {
        this.setState(sortFilter)
    }

    render() {
        return <></>
    }
}

class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.sortWay = uiStorage.getRecordSortWay()
        this.tagsFilter = uiStorage.getRecordTagsFilter()
        this.typeFilter = uiStorage.getRecordTypeFilter()

        this.pageNo = 1
        this.count = 0

        this.minHeight = utils.getRecordMinHeight()
    }

    getSortFilter() {
        return {
            sortWay: this.sortWay,
            tagsFilter: this.tagsFilter,
            typeFilter: this.typeFilter
        }
    }

    async getData() {
        const { sortFilter, isSortFilterChange } = utils.getDataSortFilter(this)
        const list = await server.getRecordData({ sortFilter, pageNo: this.pageNo }) // it must success
        if (isSortFilterChange) this.count = await server.getRecordDataCount({ sortFilter }) // it must success
        return { list, count: this.count }
    }

    async getMore() {
        this.pageNo++
        const { list } = await this.getData()
        return list
    }

    render() {
        const { minHeight } = this
        const { data, isSearch, search, edit } = this.props
        const { ListItemContainer, RrcordItem, DiaryItem } = this.props.children
        const list = isSearch ? search : data

        return <div className="record-mobile-list">{list.map((item, key) =>
            <ListItemContainer
                minHeight={minHeight}
                title={item.title}
                imageArray={utils.getRecordImageArray({ imageArrayString: item.images })}
                tag={item.tag}
                timestamp={item.timestamp}
                edit={edit}
            >{utils.isDiaryRecord(item) ?
                <RrcordItem key={`record-${key}`} record={item.content} />
                :
                <DiaryItem key={`diary-${key}`} diary={utils.getDiaryJson(item.content)} />
                }</ListItemContainer>
        )}</div>
    }
}

const ListItemContainer = ({ minHeight, title, imageArray, tag, timestamp, edit, children }) => <div className="list-item-container" style={minHeight} >
    <div className="list-item-title">{title}</div>

    {children}

    {imageArray.length > 0 && <div className="image-show">
        <div className="image-show-container">
            {imageArray.map((image, key) => (
                <div className="image-show-item" key={key}>
                    <div className="image-item-container flex-center"
                        onClick={() => showBigImageHandle(utils.getRecordImageUrl(image))}
                    >
                        <img alt="image" src={utils.getRecordImageUrl(image)} ></img>
                    </div>
                </div>
            ))}
        </div>
    </div>}

    <div className="list-item-operating flex-start-center">
        <div className="operating-tag flex-rest">{utils.getRecordTagName(tag)}</div>
        <div className="operating-navigate flex-center"
            onClick={edit}
        >编辑</div>
        <div className="operating-time flex-rest">{timeTransformers.dateToFormat(new Date(+timestamp))}</div>
    </div>
</div>

const RrcordItem = ({ record }) => <div className="list-item-content" dangerouslySetInnerHTML={utils.dangerouslySetInnerHTML(record)}></div>

const DiaryItem = ({ diary: { clusion, situation, target, action, result } }) => {
    const Content = ({ data }) => !!data ? <div className="list-item-content" dangerouslySetInnerHTML={utils.dangerouslySetInnerHTML(data)}></div> : <></>

    return [
        <Content key='clusion' data={clusion} />,
        <Content key='situation' data={situation} />,
        <Content key='target' data={target} />,
        <Content key='action' data={action} />,
        <Content key='result' data={result} />
    ]
}

class LoadMore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <></>
    }
}

class EditModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <></>
    }
}

class TagsModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <></>
    }
}

class TimeModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <></>
    }
}

const utils = {
    initLayoutRef: self => {
        self.listRef = React.createRef()
        self.operateBarRef = React.createRef()
        self.editModelRef = React.createRef()
        self.tagsModelRef = React.createRef()
        self.timeModelRef = React.createRef()
    },

    getRecordMinHeight: () => {
        const clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        const minHeight = clientHeight - 147
        return { minHeight: `${minHeight}px` }
    },

    getRecordImageUrl: image => `${BASE_CONST.TENCENT_OSS_RESOURCE}/${image}`,

    getRecordTagName: tag => {
        if (!tag) return 'All'
        if (tag == 'null') return 'All'
        return tag
    },

    getRecordImageArray: images => {
        const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: imageArrayString, isArray: true })
        if (!verifyJSONresult.isCorrect) return []
        return verifyJSONresult.data
    },

    dangerouslySetInnerHTML: data => {
        if (!data) return { __html: '' }
        return { __html: data.record.replace(/\n/g, "<br>") }
    },

    getDiaryJson: data => {
        let diary = CONST.DATA_FORMAT.diary
        if (!data || data == 'null') return diary
        const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: data })
        if (verifyJSONresult.isCorrect) diary = verifyJSONresult.data
        return diary
    },

    isSortFilterChange: function isSortFilterChange(sortFilter) {
        const self = this
        const mySortFilterString = JSON.stringify(sortFilter)
        const saveAndRe = isChange => {
            self.sortFilterString = mySortFilterString
            return isChange
        }

        if (!this.sortFilterString) return saveAndRe({ isChange: true })
        return saveAndRe({ isChange: this.sortFilterString !== mySortFilterString })
    },

    getDataSortFilter: function getDataSortFilter(self) {
        const sortFilter = { /** TODO */ }

        return {
            sortFilter,
            isSortFilterChange: this.isSortFilterChange(sortFilter)
        }
    },
}

const server = {}
