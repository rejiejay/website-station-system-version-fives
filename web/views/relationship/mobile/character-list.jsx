const useState = React.useState

const CONST = {
    PEOPLE_LIST: {
        DEFAULT: [],
        ITEM: {}
    }
}

export default class CharacterListComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: CONST.PEOPLE_LIST.DEFAULT
        }

        this.listRef = React.createRef()
    }

    async componentDidMount() {
        await login()
        await this.listRef.init()
    }

    async searchHandle(keyWords) {
        const fetchtInstance = await fetch.get('searchListData', keyWords)
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)
        const list = fetchtInstance.data
        this.listRef.swithcSearchList(list)
    }

    render() {
        return [
            <SearchBar
                searchHandle={this.searchHandle}
                cancelHandle={this.listRef.swithcTimeSort}
            />,
            <List ref={this.listRef} />
        ]
    }
}

class List extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isSearch: false,
            search: CONST.PEOPLE_LIST.DEFAULT,
            list: CONST.PEOPLE_LIST.DEFAULT
        }

        this.pageNo = 1
        this.pageCount = 10
    }

    init() {
        const list = await this.getListByTimeSort({ pageNo: 1 })
        this.setState({ list })
    }

    async getListByTimeSort({ pageNo }) {
        const fetchtInstance = await fetch.get('getListData', pageNo)
        if (fetchtInstance.result !== 1) {
            alert(fetchtInstance.message)
            return []
        }

        const list = fetchtInstance.data
        return list
    }

    swithcTimeSort() {
        this.setState({ isSearch: false })
    }

    swithcSearchList(list) {
        this.setState({ isSearch: true, search: list })
    }

    addPageNoHandle() {
        const { list } = this.state
        this.pageNo++

        const newList = await this.getListByTimeSort({ pageNo: 1 })
        if (newList.length <= 0) return

        this.setState({ list: list.concat(newList) })
    }

    onClickHandle(item) {
        jumpToTimeLine(item)
    }

    render() {
        return <></>
    }
}

const SearchBar = ({ searchHandle, cancelHandle }) => {
    const [keyWords, setKeyWords] = useState('')

    const onChangeHandle = ({ target: { value } }) => {
        setKeyWords(value)

        if (!value) return cancelHandle()
        searchHandle(value)
    }

    return <></>
}
