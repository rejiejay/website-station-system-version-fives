import login from './../../components/login.js';
import fetch from './../../components/async-fetch/fetch.js';
import { confirmPopUp } from './../../components/confirm-popup.js';
import toast from './../../components/toast.js';
import constHandle from './../../utils/const-handle.js';
import { queryToUrl, loadPageVar } from './../../utils/url-handle.js';
import timeTransformers from './../../utils/time-transformers.js';
import { arrayDuplicateByKey } from './../../utils/array-handle.js';
import { actionSheetPopUp } from './../../components/action-sheet.js';

import CONST from './const.js';
import BASE_CONST from './../const.js';
import server from './server.js';
import { initSort, updateSort } from './utils.js';

export default class MobileComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            sort: CONST.SORT.DEFAULT.value,
            tag: null,
            tags: [],
            type: CONST.DATA_TYPE.DEFAULT.value,
            search: null,

            minTimestamp: null,
            maxTimestamp: null,

            firstData: null,
            list: CONST.DATA.DEFAULT_LIST,

            pageNo: 1,
            count: 1,
            pageSize: CONST.DEFAULT_PAGE_SIZE.mobile
        }

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async componentDidMount() {
        await login()
        await this.initTag({})
        await this.initData()
    }

    async initTag({ isForceRefresh }) {
        const tags = await server.getTags({ isForceRefresh })
        this.setState({ tags })
    }

    async initData() {
        const id = loadPageVar('id')
        const sort = initSort()
        const tag = loadPageVar('tag')
        const type = loadPageVar('type')
        const search = loadPageVar('search')
        const minTimestamp = loadPageVar('minTimestamp')
        const maxTimestamp = loadPageVar('maxTimestamp')

        this.setState({
            sort,
            tag,
            type: (type === 0 || !!type) ? +type : null,
            search,
            minTimestamp,
            maxTimestamp
        })

        /** 
         * 需求: 如果标签存在id, 第一条显示次条数据
         * 初衷: 防止编辑一条id后, 找不到这条数据了
         */
        if (id) this.initDataById(id)

        if (!!search) return await this.initDataBySearch()
        if (!sort) return await this.initDataByTime({})
        if (sort === CONST.SORT.TIME.value) await this.initDataByTime({})
        if (sort === CONST.SORT.RANDOM.value) await this.initDataByRandom()
    }

    initDataById(id) {
        const self = this
        fetch.get({
            url: 'record/get/one',
            query: { id }
        }).then(
            ({ data }) => self.setState({ firstData: data }),
            error => { }
        )
    }

    async initDataByTime({ isForceRefresh }) {
        const { pageNo, pageSize, count, tag, type, list, minTimestamp, maxTimestamp } = this.state
        const self = this

        await fetch.get({
            url: 'record/get/list',
            query: { pageNo, pageSize, tag, type, minTimestamp, maxTimestamp }
        }).then(
            ({ data }) => {
                if (data.length === 0) return toast.show('已加载完成所有数据!')

                if (isForceRefresh) return self.setState({ pageNo: 1, list: data })

                /** 是否新增, 通过 pageNo 判断 */
                if (list.length > 0 && pageNo > 1 && count > 1) return self.setState({ list: list.concat(data) })

                self.setState({ list: data })
            },
            error => { }
        )

        this.initStatistics(isForceRefresh)
    }

    async initStatistics(isForceRefresh) {
        const { tag, type, minTimestamp, maxTimestamp } = this.state

        const count = await server.getStatistics({ tag, type, minTimestamp, maxTimestamp, isForceRefresh })
        this.setState({ count })
    }

    async initDataByRandom() {
        const self = this
        const { pageNo, pageSize, count, list, tag, type } = this.state

        await fetch.get({
            url: 'record/get/random',
            query: { size: pageSize, tag, type }
        }).then(
            ({ data }) => {
                /** 是否新增, 通过 pageNo 判断 */
                if (list.length > 0 && pageNo > 1) return self.setState({ list: arrayDuplicateByKey(list.concat(data), 'id') })

                self.setState({ list: data })
            },
            error => { }
        )
    }

    async initDataBySearch() {
        const self = this
        const { search, pageSize, tag, type } = this.state

        await fetch.get({
            url: 'record/search',
            query: { keyword: search, searchSize: pageSize, tag, type }
        }).then(
            ({ data }) => self.setState({ pageNo: 1, list: data }),
            error => { }
        )

        this.initStatistics()
    }

    async searchHandle({ target: { value } }) {
        if (!value) return this.clearSearch()

        this.setState(
            { search: value, minTimestamp: null, maxTimestamp: null },
            this.initDataBySearch
        )
    }

    clearSearch() {
        this.setState({ pageNo: 1, search: null })
        this.initData()
    }

    showTagsSelected() {
        const self = this
        const { tags } = this.state

        const handle = ({ value, label }) => {
            self.setState({ tag: value })
            const { sort, type, minTimestamp, maxTimestamp } = self.state
            let query = { sort, tag: value, type, minTimestamp, maxTimestamp }
            window.location.replace(`./index.html${queryToUrl(query)}`)
            toast.show()
        }

        actionSheetPopUp({
            title: '请选择标签',
            options: [{ label: '所有', value: '' }].concat(tags.map(tag => ({ label: tag, value: tag }))),
            handle
        })
    }

    showDataTypeSelected() {
        const self = this

        const handle = ({ value, label }) => {
            self.setState({ type: value })
            const { sort, tag, minTimestamp, maxTimestamp } = self.state
            let query = { sort, tag, type: value, minTimestamp, maxTimestamp }
            window.location.replace(`./index.html${queryToUrl(query)}`)
            toast.show()
        }

        actionSheetPopUp({
            title: '请选择数据类型',
            options: constHandle.toDownSelectFormat({
                CONST: CONST.DATA_TYPE,
                labelName: 'label',
                valueName: 'value'
            }),
            handle
        })
    }

    showSortSelected() {
        const self = this

        const handle = ({ value, label }) => {
            updateSort({ sort: value })
            self.setState({ sort: value })
            const { tag, type, minTimestamp, maxTimestamp } = self.state
            let query = { sort: value, tag, type, minTimestamp, maxTimestamp }
            window.location.replace(`./index.html${queryToUrl(query)}`)
            toast.show()
        }

        actionSheetPopUp({
            title: '请选择排序方式',
            options: constHandle.toDownSelectFormat({
                CONST: CONST.SORT,
                labelName: 'label',
                valueName: 'value'
            }),
            handle
        })
    }

    clearTimestampSelected() {
        const self = this

        const handle = () => {
            self.setState({ minTimestamp: null, maxTimestamp: null })
            const { sort, tag, type } = self.state
            let query = { sort, tag, type, minTimestamp: null, maxTimestamp: null }
            window.location.replace(`./index.html${queryToUrl(query)}`)
            toast.show()
        }

        confirmPopUp({
            title: '你确定要清时间选择吗?',
            succeedHandle: handle
        })
    }

    navigateToDetail({ id }) {
        const { sort, tag, type, minTimestamp, maxTimestamp } = this.state
        window.location.href = `./edit/index.html${queryToUrl({ id, sort, tag, type, minTimestamp, maxTimestamp })}`
    }

    showBigImageHandle = imageUrl => previewImage.start({ urls: [imageUrl], current: imageUrl })

    showMoreHandle() {
        const self = this
        const { sort, pageNo } = this.state

        this.setState({ pageNo: pageNo + 1 }, () => {
            if (!sort || sort === CONST.SORT.TIME.value) self.initDataByTime({})
            if (sort === CONST.SORT.RANDOM.value) self.initDataByRandom()
        })
    }

    showMoreHeaderOption() {
        const self = this
        let { sort, tag, type } = this.state

        const handle = ({ value, label }) => {
            if (value === CONST.MOBILE_HEADER_DOWN_SELECT.TIME_SELECT.value) return window.location.href = `./time-selection/index.html${queryToUrl({ sort, tag, type })}`
            if (value === CONST.MOBILE_HEADER_DOWN_SELECT.ADD_RECORD.value) type = CONST.DATA_TYPE.RECORD.value
            if (value === CONST.MOBILE_HEADER_DOWN_SELECT.ADD_DIARY.value) type = CONST.DATA_TYPE.DIARY.value

            window.location.href = `./edit/index.html${queryToUrl({ sort, tag, type })}`
        }

        actionSheetPopUp({
            title: '请选择操作项目',
            options: constHandle.toDownSelectFormat({
                CONST: CONST.MOBILE_HEADER_DOWN_SELECT,
                labelName: 'label',
                valueName: 'value'
            }),
            handle
        })
    }

    render() {
        const self = this
        const { clientHeight } = this
        let { firstData, list, tag, type, sort, search, count, minTimestamp, maxTimestamp } = this.state
        const minItemHeight = clientHeight - 147
        let diff = count - list.length
        diff = diff > 0 ? diff : 0
        if (firstData && list.length > 0 && firstData.id !== list[0].id) list = [firstData].concat(list)

        return [
            <div className="mobile-header noselect">
                {minTimestamp && maxTimestamp &&
                    <div className="header-filter flex-center"
                        onClick={this.clearTimestampSelected.bind(this)}
                    >
                        日期时间:{timeTransformers.dateToFormat(new Date(+minTimestamp))}-{timeTransformers.dateToFormat(new Date(+maxTimestamp))}
                    </div>
                }

                {!minTimestamp && !maxTimestamp && <div className="header-filter flex-start">
                    <div className="header-filter-des flex-rest flex-start-center"
                        onClick={this.showTagsSelected.bind(this)}
                    >
                        <div className="header-filter-des flex-rest flex-center">标签:{tag ? tag : 'ALL'}</div>
                    </div>
                    <div className="header-filter-separation"></div>
                    <div className="header-filter-des flex-rest flex-start-center"
                        onClick={this.showDataTypeSelected.bind(this)}
                    >
                        <div className="header-filter-des flex-rest flex-center">数据:{(type === 0 || !!type) ? constHandle.findValueByValue({ CONST: CONST.DATA_TYPE, supportKey: 'value', supportValue: type, targetKey: 'label' }) : 'ALL'}</div>
                    </div>
                </div>}

                <div className="header-operating flex-start-center">
                    <div className="left-operating flex-start-center">
                        <div className="operat-item hover-item"
                            onClick={this.showSortSelected.bind(this)}
                        >{sort ? constHandle.findValueByValue({ CONST: CONST.SORT, supportKey: 'value', supportValue: sort, targetKey: 'label' }) : '默认排序'}</div>
                    </div>

                    <div className="search flex-rest">
                        <div className="search-container flex-start-center">
                            <svg className="search-icon" width="16" height="16" t="1583588302175" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192">
                                <path d="M1007.548064 899.256487L801.043871 692.754294c-3.577986-3.577986-8.032969-5.329979-12.194952-8.032969C908.82345 515.091988 893.926508 279.233909 742.042101 127.349503c-169.701337-169.775337-444.918262-169.775337-614.692598 0-169.775337 169.701337-169.775337 444.845262 0 614.692598 153.5634 153.5644 392.635466 166.708349 562.701801 42.498834 2.701989 3.869985 4.380983 8.104968 7.73997 11.536955L904.296468 1002.582084c28.624888 28.551888 74.773708 28.551888 103.252596 0 28.477889-28.623888 28.477889-74.846708 0-103.324597zM655.074441 654.927442c-121.653525 121.654525-318.884754 121.654525-440.611279 0-121.653525-121.652525-121.653525-318.956754 0-440.610279s318.884754-121.653525 440.611279 0c121.726525 121.726525 121.726525 318.957754 0 440.611279z" p-id="1193"></path>
                            </svg>
                            <div className="search-input flex-rest">
                                <input type="text" placeholder="输入结论关键字搜索..."
                                    value={search}
                                    onChange={this.searchHandle.bind(this)}
                                />
                            </div>
                            <svg className="cancel-icon" width="16" height="16" t="1583588453664" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2562"
                                onClick={this.clearSearch.bind(this)}
                            >
                                <path d="M512 992a484.4 484.4 0 0 1-191.856-39.824 36.32 36.32 0 0 1 28.96-66.608 409.248 409.248 0 1 0-173.024-143.344 36.448 36.448 0 0 1-60.096 41.264A480.112 480.112 0 1 1 512 992z" p-id="2563"></path>
                                <path d="M373.2 686.208a37.488 37.488 0 0 1-26.592-11.088 37.936 37.936 0 0 1 0-52.464l279.28-275.584a37.104 37.104 0 1 1 52.464 52.464L399.072 675.12a35.84 35.84 0 0 1-25.872 11.088z" p-id="2564"></path>
                                <path d="M662 686.192a34.656 34.656 0 0 1-25.856-11.088L360.56 399.52a37.104 37.104 0 0 1 52.464-52.464l275.584 275.584a36.576 36.576 0 0 1 0 52.464 37.488 37.488 0 0 1-26.608 11.088z" p-id="2565"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="right-operating flex-start-center">
                        <div className="operat-item"
                            onClick={this.showMoreHeaderOption.bind(this)}
                        >
                            <svg width="16" height="16" t="1590236984624" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1134">
                                <path d="M224 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM544 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96zM864 512a32 32 0 1 0-32 32 32 32 0 0 0 32-32z m64 0a96 96 0 1 1-96-96 96 96 0 0 1 96 96z" p-id="1135"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>,

            <div className="mobile-list">{list.map(({ id, tag, type, title, content, timestamp, images }, key) => {
                let record = content
                if (type === CONST.DATA_TYPE.DIARY.value) record = server.getJsonByDataType({ type, content })
                const imageArray = server.getImageArray({ imageArrayString: images })

                return (
                    <div className="list-item" key={key}>
                        <div className="list-item-container" style={{ minHeight: `${minItemHeight}px` }} >
                            <div className="list-item-title">{title}</div>
                            {type === CONST.DATA_TYPE.RECORD.value && <div className="list-item-content" dangerouslySetInnerHTML={{ __html: record.replace(/\n/g, "<br>") }}></div>}
                            {type === CONST.DATA_TYPE.DIARY.value && [
                                record.clusion && <div className="list-item-content" dangerouslySetInnerHTML={{ __html: `结论: ${record.clusion.replace(/\n/g, "<br>")}` }}></div>,
                                record.situation && <div className="list-item-content" dangerouslySetInnerHTML={{ __html: `情况: ${record.situation.replace(/\n/g, "<br>")}` }}></div>,
                                record.target && <div className="list-item-content" dangerouslySetInnerHTML={{ __html: `目标: ${record.target.replace(/\n/g, "<br>")}` }}></div>,
                                record.action && <div className="list-item-content" dangerouslySetInnerHTML={{ __html: `行动: ${record.action.replace(/\n/g, "<br>")}` }}></div>,
                                record.result && <div className="list-item-content" dangerouslySetInnerHTML={{ __html: `结果: ${record.result.replace(/\n/g, "<br>")}` }}></div>
                            ]}
                            {imageArray.length > 0 && <div className="image-show">
                                <div className="image-show-container">
                                    {imageArray.map((image, key) => (
                                        <div className="image-show-item" key={key}>
                                            <div className="image-item-container flex-center"
                                                onClick={() => self.showBigImageHandle(`${BASE_CONST.TENCENT_OSS_RESOURCE}/${image}`)}
                                            >
                                                <img alt="image" src={`${BASE_CONST.TENCENT_OSS_RESOURCE}/${image}`} ></img>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>}
                            <div className="list-item-operating flex-start-center">
                                <div className="operating-tag flex-rest">{tag ? tag : 'ALL'}</div>
                                <div className="operating-navigate flex-center"
                                    onClick={() => self.navigateToDetail({ id })}
                                >编辑</div>
                                <div className="operating-time flex-rest">{timeTransformers.dateToFormat(new Date(+timestamp))}</div>
                            </div>
                        </div>
                    </div>
                )
            })}</div>,

            !search && <div className="mobile-load">
                <div className="mobile-load-container flex-center"
                    onClick={this.showMoreHandle.bind(this)}
                >加载更多{sort !== CONST.SORT.RANDOM.value && ` (${diff})`}</div>
            </div>
        ]
    }
}

