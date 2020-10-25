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

    async tagsFilterHandle(tags) {
        const { list, count } = await this.listRef.current.filterTags(tags) // must success && reload list && persistence
        this.setState({ list, count })
    }

    async typeFilterHandle(dataType) {
        const { list, count } = await this.listRef.current.filterType(dataType) // must success && reload list && persistence
        this.setState({ list, count })
    }

    async onSearchChange({ target: { value } }) {
        if (!value) return this.setState({ isSearch: false, search: [] })

        const search = await this.listRef.current.getSearch(value) // must success
        this.setState({ isSearch: !!value, search })
    }

    async timeFilterHandle({ minTimestamp, maxTimestamp }) {
        const { list, count } = await this.listRef.current.filterTime({ minTimestamp, maxTimestamp }) // must success && reload list && not need persistence
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
                showTagsFilter={() => tagsModelRef.current.show()}
                tagsFilterHandle={this.tagsFilterHandle.bind(this)}
                typeFilterHandle={this.typeFilterHandle.bind(this)}
                onSearchChange={this.onSearchChange.bind(this)}
                timeFilterHandle={this.timeFilterHandle.bind(this)}
                showTimeFilter={() => timeModelRef.current.show()}
            >{{
                StatusInformation
            }}</OperateBar>,
            <EditModel ref={editModelRef} >{{
                Modal,
                MobileInput
            }}</EditModel>,
            <TagsModel ref={tagsModelRef} >{{
                Modal
            }}</TagsModel>,
            <TimeModel ref={timeModelRef} >{{
                Modal
            }}</TimeModel>
        ]
    }
}

class OperateBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // [sort, tags, type] is Persistence
            sortWay: uiStorage.getRecordSortWay(),
            tagsFilter: uiStorage.getRecordTagsFilter(),
            typeFilter: uiStorage.getRecordTypeFilter(),
            searchValue: '',
            minTimestamp: null,
            maxTimestamp: null,
        }
    }

    components = {
        Search: ({ value, onSearchChange }) => {
            const searchHandle = ({ target: { value } }) => onSearchChange(value)
            const clearSearch = () => onSearchChange('')

            return <div className="search flex-rest">
                <div className="search-container flex-start-center">
                    <svg className="search-icon" width="16" height="16" t="1583588302175" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192">
                        <path d="M1007.548064 899.256487L801.043871 692.754294c-3.577986-3.577986-8.032969-5.329979-12.194952-8.032969C908.82345 515.091988 893.926508 279.233909 742.042101 127.349503c-169.701337-169.775337-444.918262-169.775337-614.692598 0-169.775337 169.701337-169.775337 444.845262 0 614.692598 153.5634 153.5644 392.635466 166.708349 562.701801 42.498834 2.701989 3.869985 4.380983 8.104968 7.73997 11.536955L904.296468 1002.582084c28.624888 28.551888 74.773708 28.551888 103.252596 0 28.477889-28.623888 28.477889-74.846708 0-103.324597zM655.074441 654.927442c-121.653525 121.654525-318.884754 121.654525-440.611279 0-121.653525-121.652525-121.653525-318.956754 0-440.610279s318.884754-121.653525 440.611279 0c121.726525 121.726525 121.726525 318.957754 0 440.611279z" p-id="1193"></path>
                    </svg>
                    <div className="search-input flex-rest">
                        <input type="text" placeholder="输入结论关键字搜索..."
                            value={value}
                            onChange={searchHandle}
                        />
                    </div>
                    <svg className="cancel-icon" width="16" height="16" t="1583588453664" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2562"
                        onClick={clearSearch}
                    >
                        <path d="M512 992a484.4 484.4 0 0 1-191.856-39.824 36.32 36.32 0 0 1 28.96-66.608 409.248 409.248 0 1 0-173.024-143.344 36.448 36.448 0 0 1-60.096 41.264A480.112 480.112 0 1 1 512 992z" p-id="2563"></path>
                        <path d="M373.2 686.208a37.488 37.488 0 0 1-26.592-11.088 37.936 37.936 0 0 1 0-52.464l279.28-275.584a37.104 37.104 0 1 1 52.464 52.464L399.072 675.12a35.84 35.84 0 0 1-25.872 11.088z" p-id="2564"></path>
                        <path d="M662 686.192a34.656 34.656 0 0 1-25.856-11.088L360.56 399.52a37.104 37.104 0 0 1 52.464-52.464l275.584 275.584a36.576 36.576 0 0 1 0 52.464 37.488 37.488 0 0 1-26.608 11.088z" p-id="2565"></path>
                    </svg>
                </div>
            </div>
        },
        MoreOperateButton: ({ click }) => <div className="operating-button-item flex-center"
            onClick={click}
        >
            <svg width="16" height="16" t="1590236984624" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1134">
                <path d="M224 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM544 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM864 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96z" p-id="1135"></path>
            </svg>
        </div>,
        Button: ({ text, click }) => <div className="operating-button-item flex-rest flex-center"
            onClick={click}
        >
            {text}
        </div>,
    }

    showSortSelected() {
        const handle = ({ value, label }) => this.sortSelectedHandle(value)
        actionSheetPopUp(utils.getSortActionSheetList(handle))
    }

    sortSelectedHandle(value) {
        const { sortHandle } = this.props
        this.setState({ sortWay: value })
        uiStorage.setRecordSortWay(value)
        sortHandle(value)
    }

    showAddSelected() {
        const { addHandle } = this.props
        const handle = ({ value, label }) => addHandle(value)
        actionSheetPopUp(utils.getAddActionSheetList(handle))
    }

    async showTagsSelected() {
        const { showTagsFilter, tagsFilterHandle } = this.props

        const tagsInstance = await showTagsFilter()
        if (tagsInstance.result !== 1) return // Cancel tags select

        const tags = tagsInstance.data
        this.setState({ tagsFilter: tags })
        uiStorage.setRecordTagsFilter(tags)
        tagsFilterHandle(tags)
    }

    async showTypeSelected() {
        const { typeFilterHandle } = this.props
        const handle = ({ value, label }) => typeFilterHandle(value)
        actionSheetPopUp(utils.getTypeActionSheetList(handle))
    }

    async showTimeSelected() {
        const { showTimeFilter, timeFilterHandle } = this.props

        const timeInstance = await showTimeFilter()
        if (timeInstance.result !== 1) return // Cancel time select

        const { minTimestamp, maxTimestamp } = timeInstance.data
        this.setState({ minTimestamp, maxTimestamp })
        timeFilterHandle({ minTimestamp, maxTimestamp })
    }

    showMoreOperateActionSheet() {
        const handle = ({ value, label }) => {
            if (value === 1) this.showTimeSelected()
        }
        actionSheetPopUp(utils.getMoreOperateSheetList(handle))
    }

    render() {
        const { onSearchChange } = this.props
        const { StatusInformation } = this.props.children
        const { Search, MoreOperateButton, Button  } = this.components
        const { sortWay, tagsFilter, typeFilter, searchValue, minTimestamp, maxTimestamp } = this.state

        return <div className="operate-bar">
            <StatusInformation
                sortWay={sortWay}
                clearSortHandle={() => this.sortSelectedHandle(null)}
                tagsFilter={tagsFilter}
                showTagsSelected={this.showTagsSelected.bind(this)}
                typeFilter={typeFilter}
                minTimestamp={minTimestamp}
                maxTimestamp={maxTimestamp}
            />
            <div className="operate-button-list flex-start">
                <MoreOperateButton click={this.showMoreOperateActionSheet.bind(this)} />
                <Search value={searchValue} onSearchChange={onSearchChange} />
                <Button key='type' text={utils.getTypeFilterName(typeFilter)} click={this.showTypeSelected.bind(this)} />
                <Button key='tags' text='标签' click={this.showTagsSelected.bind(this)} />
                <Button key='sort' text={utils.getSortWayName(sortWay)} click={this.showSortSelected.bind(this)} />
                <Button key='add' text='新增' click={this.showAddSelected.bind(this)} />
            </div>
        </div>
    }
}

class StatusInformation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false
        }
    }

    renderItem = ({ isShow, text, clickHandle }) => {
        if (!isShow) return <></>
        return <div className="status-information-item"
            onClick={clickHandle}
        >
            {text}
        </div>
    }

    render() {
        const { sortWay, clearSortHandle, tagsFilter, showTagsFilter, typeFilter, minTimestamp, maxTimestamp } = this.props
        const { isShow } = this.state
        const Item = this.renderItem

        return <div className="operate-status-information">

            <div className="status-information-bar" 
                onClick={() => this.setState({ isShow: !isShow })}
            >{isShow ? 'hiden' : 'show'}</div>

            {isShow && <div className="status-information-content">
                <Item key='sortWay'
                    isShow={utils.isShowSortWay(sortWay)}
                    text={utils.vauleToLable(sortWay)}
                    clickHandle={clearSortHandle}
                />
                <Item key='tagsFilter'
                    isShow={tagsFilter.length > 0}
                    text={utils.tagsToLable(tagsFilter)}
                    clickHandle={showTagsFilter}
                />
            </div>}
        </div>
    }
}

class List extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }

        this.sortWay = uiStorage.getRecordSortWay()
        this.tagsFilter = uiStorage.getRecordTagsFilter()
        this.typeFilter = uiStorage.getRecordTypeFilter()

        this.pageNo = 1
        this.count = 0

        this.minHeight = utils.getRecordMinHeight()
    }

    async getData() {
        const { sortFilter, isSortFilterChange } = utils.getDataSortFilter(this)
        const list= await server.getRecordData({ ...sortFilter, pageNo: this.pageNo }) // it must success
        if (isSortFilterChange) this.count = await server.getRecordDataCount({ ...sortFilter }) // it must success
        return { list, count: this.count }
    }

    async getMore() {
        this.pageNo++
        const { list } = await this.getData()
        return list
    }

    async switchSortWay(sortWay) {
        this.sortWay = sortWay
        const { list } = await this.getData()
        return list
    }

    async filterTags(tags) {
        this.tagsFilter = tags
        const { list, count } = await this.getData()
        return { list, count }
    }

    async filterTime({ minTimestamp, maxTimestamp }) {
        this.minTimestamp = minTimestamp
        this.maxTimestamp = maxTimestamp
        const { list, count } = await this.getData()
        return { list, count }
    }

    async getSearch(value) {
        const list = await await server.getRecordSearch({ ...sortFilter, search: value })
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
        this.state = { }
    }

    render() {
        return <></>
    }
}

class EditModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageStatus: CONST.EDIT_PAGE_STATUS.DEFAULT.value,

            title: '',
            content: CONST.DATA_TYPE_CONTENT.DEFAULT.value,
            tag: '',
            type: CONST.DATA_TYPE.DEFAULT.value,
            timestamp: new Date().getTime(),
            images: ''
        }

        this.originalData = CONST.TASK.FORMAT // For Edit Compared
        this.resolve = null
    }

    components = {
        ContentInputRightTopDiv: ({ dataTypeSelectedHandle, type }) => <div className="data-type-selected"
            onClick={dataTypeSelectedHandle}
        >
            数据类型: {constHandle.findValueByValue({ CONST: CONST.DATA_TYPE, supportKey: 'value', supportValue: type, targetKey: 'label' })}
        </div>,
        TimestampPicka: ({ timestamp, timeStampHandle }) => {
            const datepickerHandle = () => {
                const nowYear = new Date().getFullYear()
        
                const datepicker = new Rolldate({
                    el: '#picka-date',
                    format: 'YYYY-MM-DD hh:mm',
                    beginYear: nowYear - 10,
                    endYear: nowYear + 10,
                    lang: { title: '当时时间?' },
                    confirm: data => timeStampHandle(timeTransformers.YYYYmmDDhhMMToTimestamp(data))
                })
        
                datepicker.show()
            }
            const timeStampClearHandle = () => {
                document.getElementById('picka-date').value = ''
                timeStampHandle(null)
            }

            return [
                <div class="edit-title">当时时间?</div>,
                <div class="edit-input flex-start-center">
                    <input readonly type="text" id="picka-date"
                        value={timestamp ? timeTransformers.dateToYYYYmmDDhhMM(new Date(+timestamp)) : ''}
                        placeholder="时间?"
                        onClick={datepickerHandle}
                    />
                    <div class="picka-clear flex-center"
                        onClick={timeStampClearHandle}
                    >取消</div>
                </div>
            ]
        },
        ImageTagSelect: ({ tag, showTagsSelected, uploadFileImage }) => {
            const uploadEl = useRef(null);
            const uploadFileHandle = ({ target: { files } }) => uploadFileImage(files[0])

            return <div className="select-operation">
                <input className="image-input"
                    style={{ display: 'none' }}
                    ref={uploadEl}
                    type="file"
                    name="file"
                    onChange={uploadFileHandle}
                />
                <div className="select-operation-container flex-start-center">
                    <div className="select-tag flex-rest flex-center"
                        onClick={showTagsSelected}
                    >{tag ? `标签分类:${tag}` : '请选择标签'}</div>
                    <div className="select-image flex-rest flex-center"
                        onClick={() => uploadEl.current.click()}
                    >请选择图片</div>
                </div>
            </div>
        },
        ImageList: ({ imageArray, delImageHandle }) => {
            if (imageArray.length <= 0) return <></>

            return <div className="mobile-list-image">
                <div className="list-image-title">图片列表</div>
                <div className="list-image-container">
                    {imageArray.map((image, key) => (
                        <div className="list-image-item" key={key}>
                            <div className="image-item-container flex-center"
                                style={{ height: imageSize, width: imageSize }}
                                onClick={() => delImageHandle(key)}
                            >
                                <img alt="image" src={`${BASE_CONST.TENCENT_OSS_RESOURCE}/${image}`} ></img>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        },
    }

    showAdd({ type }) {
        const self = this
        let state = { pageStatus: 'add', title: '', content: CONST.DATA_TYPE_CONTENT.DEFAULT.value, tag: '', type: CONST.DATA_TYPE.DEFAULT.value, timestamp: new Date().getTime(), images: '' }
        if (type) {
            state.content = utils.getEditDefaultContent(type)
            state.type = type
        }
        this.setState(state)

        return new Promise(resolve => self.resolve = resolve)
    }

    async showEdit(task) {
        const self = this

        this.originalData = await server.getTaskDetail({ id: task.id }) // must success
        this.setState(utils.initEditState(this.originalData))

        return new Promise(resolve => self.resolve = resolve)
    }

    async addHandle() {
        const bodyInstance = utils.checkEditState(this)
        if (bodyInstance.result !== 1) toast.show(itemInstance.message)
        const fetch = await server.addRecord(bodyInstance.data) // must success
        this.resolve(consequencer.success(fetch))
    }

    cancelHandle() {
        this.resolve(consequencer.error('cancel', 2))
    }

    async editHandle() {
        const bodyInstance = utils.checkEditState(this)
        if (bodyInstance.result !== 1) toast.show(itemInstance.message)
        const fetch = await server.editRecord(bodyInstance.data) // must success
        this.resolve(consequencer.success(fetch))
    }

    async delHandle() {
        const bodyInstance = utils.checkEditState(this)
        if (bodyInstance.result !== 1) toast.show(itemInstance.message)
        const fetch = await server.editRecord(bodyInstance.data) // must success
        this.resolve(consequencer.success(fetch))
    }

    render() {
        const { Modal, MobileInput } = this.props.children
        const { pageStatus, title, content, type, tag, timestamp, images } = this.state
        const { ContentInputRightTopDiv, TimestampPicka, ImageTagSelect, ImageList } = this.components
        const { situation, target, action, result } = utils.getDiaryData({ content })

        return <Modal
            visible={pageStatus !== 'hiden'}
            isFullScreen={true}
        >
            <div className="edit-detail-modal">
                <MobileInput key='title'
                    value={title}
                    onChangeHandle={value => {}}
                    isRequiredHighlight
                    isAutoHeight={false}
                    height={250}
                    title='简单描述/提问/归纳'
                    placeholder='what情景? + what动作/冲突/方案'
                />
                <MobileInput key='content'
                    value={content}
                    onChangeHandle={value => {}}
                    isAutoHeight
                    height={250}
                    title='得出什么结论?'
                    placeholder='结论1: (情景是啥?)是什么?为什么?怎么办?'
                >{{
                    rightTopDiv: <ContentInputRightTopDiv
                        type={type}
                        click={() => {}}
                    />
                }}</MobileInput>
                {utils.isDiaryType(type) && [
                    <MobileInput key='situation'
                        value={situation}
                        onChangeHandle={value => {}}
                        isAutoHeight={true}
                        height={125}
                        title='情况是什么'
                        placeholder='情况? 是什么?为什么?有啥影响?'
                    />,
                    <MobileInput key='target'
                        value={target}
                        onChangeHandle={value => {}}
                        isAutoHeight={true}
                        height={125}
                        title='当时目标想法是什么'
                        placeholder='想法1: 想干什么?为什么想这么做?最后去实现想法了吗?'
                    />,
                    <MobileInput key='action'
                        value={action}
                        onChangeHandle={value => {}}
                        isTextarea={true}
                        isAutoHeight={true}
                        height={125}
                        title='当时行动是什么'
                        placeholder='行动1: 做了什么?为什么这么做?'
                    />,
                    <MobileInput key='result'
                        value={result}
                        onChangeHandle={value => {}}
                        isAutoHeight={true}
                        height={125}
                        title='当时结果是什么'
                        placeholder='结果1: 得到什么结果?为什么会得到这个结果?如果有下次应该怎么做?'
                    />
                ]}

                <TimestampPicka 
                    timestamp={timestamp}
                    timeStampHandle={this.timeStampHandle.bind(this)}
                />

                <ImageTagSelect
                    tag={tag}
                    showTagsSelected={this.showTagsSelected.bind(this)}
                    uploadFImage={this.uploadFileHandle.bind(this)}
                />

                <ImageList 
                    images={images}
                    delImageHandle={this.delFileHandle.bind(this)}
                />

                <ListOperation 
                    leftButtonFun={this.cancelHandle.bind(this)}
                    leftButtonDes={'取消'} 
                    rightOperation={[
                        { key: 'add', name: '保存', fun: this.addHandle.bind(this) }, 
                        { key: 'edit', name: '暂存', fun: this.editHandle.bind(this) }, 
                        { key: 'del', name: '删除', fun: this.delHandle.bind(this) }
                    ].filter(operate => utils.filterEditOperation({ operate, slef: this }))} 
                />

            </div>
        </Modal>
    }
}

const MobileInput = ({ title, value, onChangeHandle, placeholder, isRequiredHighlight, isAutoHeight, height, children }) => <div className="mobile-input">
    <div className="input-title flex-start">
        <div className="input-title flex-rest"
            style={style.inputTitleStyle(isRequiredHighlight)}
        >{isRequiredHighlight && '*'}{title}</div>
        {utils.renderRightTopDiv(children)}
    </div>
    <div className="input-area">
        <textarea type="text"
            style={style.inputTextarea(height, isAutoHeight, value)}
            value={value}
            onChange={({ target: { value } }) => onChangeHandle(value)}
            placeholder={placeholder}
        />
    </div>
</div>

class TagsModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            selectList: CONST.MULTIPLE_SELECT.DEFAULT
        }
        this.resolve = null
    }

 	async componentDidMount () {
        const selectList = await server.getTagSelectList()
        this.setState({ selectList })
    }

    show() {
        this.setState({ isShow: true })
        return new Promise(resolve => self.resolve = resolve)
    }

    confirmHandle() {
        const resultList = this.getSelectedResult()
        const tags = resultList.map(result => result.value)
        this.resolve(consequencer.success(tags))
    }

    cancelHandle() {
        this.setState({ isShow: false })
        this.resolve(consequencer.error('cancel', 2))
    }

    getSelectedResult() {
        const { selectList } = this.state
        const canSelectList = selectList.filter(item => item.isKill === false)
        const resultList = canSelectList.filter(item => item.isSelect)

        return resultList
    }

    fastSelectHandle({ isSelect }) {
        this.setState({ selectList: this.state.selectList.map(item => {
            if (item.isKill) return { ...item, isSelect: false  }
            return { ...item, isSelect  }
        }) })
    }

    listSelectHandle({ isKill, isSelect, index }) {
        const { selectList } = this.state
        this.setState({ selectList: selectList.map((item, key) => {
            if (key === index && isKill) return { ...item, isKill, isSelect: false}
            if (key === index && !isKill) return { ...item, isKill, isSelect}
            return item
        })})
    }

    unSelectResultHandle(result) {
        this.setState({ selectList: this.state.selectList.map(item => {
            if (result.lable === item.lable && result.value === item.value) return { ...item, isSelect: false  }
            return item
        }) })
    }

    components = {
        FastSelectCheckbox: class FastSelectCheckbox extends React.Component {
            constructor(props) { 
                super(props) 
            }
            render () {
                const { fastSelectHandle } = this.props
                const { Checkbox } = this.props.children
                return <div className="multiple-select-fast">
                    <Checkbox 
                        key="multiple-select"
                        name='全选'
                        callBackHandle={fastSelectHandle}
                    />
                </div>
            }
        },
        SelectList: ({ data, listSelectHandle, children: { Checkbox } }) => <div className="multiple-select-list">
            {data.map((item, key) => <Checkbox key={key}
                name={item.lable}
                haveDisable
                isKill={item.isKill}
                isSelect={item.isSelect}
                callBackHandle={({ isDisable, isSelect }) => listSelectHandle({ isKill: isDisable, isSelect, index: key })}
            />)}
        </div>,
        ResultList: class ResultList extends React.Component {
            constructor(props) { 
                super(props) 
            }
            render () {
                const { data, unSelectResultHandle } = this.props
                return <div className="multiple-select-result">
                    {data.filter(({ isKill, isSelect }) => !isKill && !!isSelect)
                    .map((item, key) => <div key={key} className="multiple-result-container">
                        <div className="multiple-result-item"
                            onClick={() => unSelectResultHandle(item)}
                        >{item.lable}</div>
                    </div>)}
                </div>
            }
        },
        Checkbox: class Checkbox extends React.Component {
            constructor(props) { 
                super(props) 
                this.state = {
                    isSelect: false,
                    isDisable: false
                } 
            }
        
            checkboxHandle() {
                const { callBackHandle } = this.props
                const { isSelect, isDisable } = this.state
        
                if (isDisable) return
                this.setState({ isSelect: !isSelect })
                callBackHandle({ isDisable, isSelect: !isSelect })
            }
        
            disableHandle() {
                const { callBackHandle } = this.props
                const { isSelect, isDisable } = this.state
        
                this.setState({ isDisable: !isDisable })
                callBackHandle({ isSelect, isDisable: !isDisable })
            }
        
            render () {
                const { name, haveDisable } = this.props
                const isSelect = this.props.isSelect !== null ? this.props.isSelect : this.state.isSelect
                const isDisable = this.props.isKill !== null ? this.props.isKill : this.state.isDisable
        
                const checkboxStyle = () => {
                    let checkboxClass = 'checkbox-name'
                    if (isSelect && !isDisable) checkboxClass += ' checkbox-name-select'
                    if (isDisable) checkboxClass += ' checkbox-name-disable'
                    return checkboxClass
                }
            
                const disableStyle = () => {
                    let checkboxClass = 'checkbox-disable'
                    if (isDisable) checkboxClass += ' checkbox-disable-effect'
                    return checkboxClass
                }
            
                return <div className="react-basic-checkbox">
                    <div className="checkbox-container flex-start noselect">
                        <div className={checkboxStyle()} onClick={this.checkboxHandle.bind(this)}>{name}</div>
                        {haveDisable && <div className={disableStyle()} onClick={this.disableHandle.bind(this)}>X</div>}
                    </div>
                </div>
            }
        }
    }

    render() {
        const { Modal } = this.props.children
        const { isShow, selectList } = this.state
        const { FastSelectCheckbox, SelectList, ResultList, Checkbox } = this.components
        const resultList = this.getSelectedResult()

        return <Modal
            visible={isShow}
            isFullScreen={true}
            confirmHandle={this.confirmHandle.bind(this)}
            cancelHandle={this.cancelHandle.bind(this)}
        >
            <div className="multiple-select">
                <FastSelectCheckbox 
                    fastSelectHandle={({ isSelect }) => this.fastSelectHandle({ isSelect })} 
                >{{ Checkbox }}</FastSelectCheckbox>

                <SelectList
                    data={selectList}
                    listSelectHandle={({ isKill, isSelect, index }) => this.listSelectHandle({ isKill, isSelect, index })} 
                >{{ Checkbox }}</SelectList>

                <ResultList 
                    data={resultList} 
                    unSelectResultHandle={item => this.unSelectResultHandle(item)} 
                />
            </div>
        </Modal>
    }
}

class TimeModel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            list: CONST.DATA.DEFAULTS
        }
        this.resolve = null
    }

    async componentDidMount() {
        const list = await server.getStatisticsTime()
        this.setState({ list })
    }

    show() {
        this.setState({ isShow: true })
        return new Promise(resolve => self.resolve = resolve)
    }

    confirmHandle(maxTimestamp, minTimestamp) {
        this.resolve(consequencer.success({ minTimestamp, maxTimestamp }))
    }

    cancelHandle() {
        this.setState({ isShow: false })
        this.resolve(consequencer.error('cancel', 2))
    }

    components = {
        Item: ({ name, count, maxTimestamp, minTimestamp, confirmHandle, children, isShowChildren, switchChildrenHandle, children: { Icon, MinifyIcon, BlowUpIcon } }) => <div className="date-item flex-start-center">
            <div className="item-name flex-rest"
                onClick={() => confirmHandle(maxTimestamp, minTimestamp)}
            >{name}</div>
            <div className="item-count">{count}</div>

            <Icon
                haveChildren={!!children}
                isShowChildren={isShowChildren}
                switchChildrenHandle={switchChildrenHandle}
            >{{
                MinifyIcon,
                BlowUpIcon
            }}</Icon>

        </div>,
        Icon: ({ haveChildren, isShowChildren, switchChildrenHandle }) => {
            if (!haveChildren) return <></>
            return <div className="item-icon flex-center"
                onClick={() => switchChildrenHandle(key)}
            >
                {!!isShowChildren ? <MinifyIcon /> : <BlowUpIcon />}
            </div>
        },
        BlowUpIcon: () => <svg width="16" height="16" t="1586918632959" viewBox="0 0 1024 1024" >
            <path d="M51.501176 1015.265882L8.734118 972.498824 349.063529 632.470588 391.529412 674.936471zM632.651294 349.003294L972.769882 8.914824l42.586353 42.586352L675.237647 391.619765z" fill="#3C22D3" p-id="916"></path>
            <path d="M1024 1024H682.164706v-60.235294H963.764706v-281.6h60.235294zM60.235294 341.835294H0V0h341.835294v60.235294H60.235294z" fill="#BF5BFF" p-id="917"></path>
            <path d="M1024 341.835294h-60.235294V60.235294h-281.6V0H1024zM341.835294 1024H0V682.164706h60.235294V963.764706h281.6z" fill="#3C22D3" p-id="918"></path>
        </svg>,

        MinifyIcon: () => <svg width="16" height="16" t="1586918802647" class="icon" viewBox="0 0 1024 1024" >
            <path d="M1023.715635 1023.715635H341.238545v-682.47709h186.259372v56.873091H398.111636v568.730908h568.730908v-568.730908h-186.259373v-56.873091H1023.715635z" fill="#3C22D3" p-id="1050"></path>
            <path d="M682.47709 682.47709h-186.259373v-56.873091H625.603999v-568.730908H56.873091v568.730908h186.259372v56.873091H0v-682.47709h682.47709z" fill="#BF5BFF" p-id="1051"></path>
        </svg>
    }

    switchChildrenHandle(key) {
        const { list } = this.state
        let myList = JSON.parse(JSON.stringify(list))

        if (list[key].hasOwnProperty('isShowChildren') && list[key].isShowChildren) {
            myList[key].isShowChildren = false
        } else {
            myList[key].isShowChildren = true
        }

        this.setState({ list: myList })
    }

    renderListChildren(upLevelList, upLevelKey) {
        const self = this
        const { list } = this.state

        const getTargetItem = originData => {
            const depth = upLevelKey.split(',')
            const depthList = []

            const firstKey = depth[0]
            const firstData = originData[firstKey]
            depthList.push(firstData)

            for (let i = 1; i < depth.length; i++) {
                const thisDepthData = depthList[depthList.length - 1]
                const thisDepthKey = depth[i]
                depthList.push(thisDepthData.children[thisDepthKey])
            }

            const finallyDepthData = depthList[depthList.length - 1]

            return finallyDepthData.children
        }

        const switchChildrenHandle = key => {
            let myList = JSON.parse(JSON.stringify(list))

            const item = getTargetItem(list)

            if (item[key].hasOwnProperty('isShowChildren') && item[key].isShowChildren) {
                getTargetItem(myList)[key].isShowChildren = false
            } else {
                getTargetItem(myList)[key].isShowChildren = true
            }

            self.setState({ list: myList })
        }

        return upLevelList.map(({ count, children, maxTimestamp, minTimestamp, name, isShowChildren }, key) => [
            <Item key={key}
                name={name}
                count={count}
                maxTimestamp={maxTimestamp}
                minTimestamp={minTimestamp}
                children={children}
                isShowChildren={isShowChildren}
                confirmHandle={self.confirmHandle.bind(self)}
                switchChildrenHandle={switchChildrenHandle}
            >{{
                Icon,
                MinifyIcon,
                BlowUpIcon
            }}</Item>,

            !!children && !!isShowChildren && self.renderListChildren(children, `${upLevelKey},${key}`)
        ])
    }

    render() {
        const self = this
        const { Modal } = this.props.children
        const { isShow, list } = this.state
        const { Icon, BlowUpIcon, MinifyIcon } = this.components

        return <Modal
            visible={isShow}
            isFullScreen={true}
            cancelHandle={this.cancelHandle.bind(this)}
        >
            <div className="date-select">{list.map(({ count, children, maxTimestamp, minTimestamp, name, isShowChildren }, key) => [
                <Item key={key}
                    name={name}
                    count={count}
                    maxTimestamp={maxTimestamp}
                    minTimestamp={minTimestamp}
                    children={children}
                    isShowChildren={isShowChildren}
                    confirmHandle={self.confirmHandle.bind(self)}
                    switchChildrenHandle={self.switchChildrenHandle.bind(self)}
                >{{
                    Icon,
                    MinifyIcon,
                    BlowUpIcon
                }}</Item>,

                !!children && !!isShowChildren && self.renderListChildren(children, `${key}`)
            ])}</div>
        </Modal>
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
        const minHeight =  clientHeight - 147
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

    getAddActionSheetList: function getAddActionSheetList(handle) {},

    filterEditOperation: function filterEditOperation({ operate, slef }) {},
}

const server = { }

const CONST = {
    MULTIPLE_SELECT: {
        DEFAULT: [],
        ITEM: {
            isKill: false,
            isSelect: false,
            value: 'for code handle',
            lable: 'for show'
        }
    },
    DATA: {
        DEFAULTS: [],
        DEMO: [{
            count: 9,
            data: [{
                count: 9,
                maxTimestamp: 1546272000000,
                minTimestamp: 1514736000000,
                name: "1月"
            }],
            maxTimestamp: 1546272000000,
            minTimestamp: 1514736000000,
            name: "2018年"
        }]
    }
}
