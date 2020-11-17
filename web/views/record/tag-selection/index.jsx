import Modal from './../../../components/modal/index.jsx'
import consequencer from './../../../utils/consequencer';
import server from './../server';

const CONST = {
    MULTIPLE_SELECT: {
        DEFAULT: [],
        ITEM: {
            isKill: false,
            isSelect: false,
            value: 'for code handle',
            lable: 'for show'
        }
    }
}

class Utils extends React.Component {
    constructor(props) {
        super(props)
    }

    getSelectedResult() {
        const { selectList } = this.state
        const canSelectList = selectList.filter(item => item.isKill === false)
        const resultList = canSelectList.filter(item => item.isSelect)

        return resultList
    }

    fastSelectHandle({ isSelect }) {
        this.setState({
            selectList: this.state.selectList.map(item => {
                if (item.isKill) return { ...item, isSelect: false }
                return { ...item, isSelect }
            })
        })
    }

    listSelectHandle({ isKill, isSelect, index }) {
        const { selectList } = this.state
        this.setState({
            selectList: selectList.map((item, key) => {
                if (key === index && isKill) return { ...item, isKill, isSelect: false }
                if (key === index && !isKill) return { ...item, isKill, isSelect }
                return item
            })
        })
    }

    unSelectResult(result) {
        this.setState({
            selectList: this.state.selectList.map(item => {
                if (result.lable === item.lable && result.value === item.value) return { ...item, isSelect: false }
                return item
            })
        })
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

    tagsMapper(tags) {
        const { selected } = this.props
        return tags.map(tag => ({
            isKill: false,
            isSelect: selected.includes(tag),
            value: tag,
            lable: tag
        }))
    }
}

class MultipleSelectLayout extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            selectList: CONST.MULTIPLE_SELECT.DEFAULT
        }
    }

    async componentDidMount() {
        const tags = await server.getTags({ isForceRefresh: true })
        const selectList = this.tagsMapper(tags)
        console.log('selectList', selectList)
        console.log('tags', tags)
        this.setState({ selectList })
    }

    render() {
        const { selectList } = this.state
        const resultList = this.getSelectedResult()

        return <div className="multiple-select">
            <FastSelectCheckbox fastSelectHandle={({ isSelect }) => this.fastSelectHandle({ isSelect })} />
            <SelectList listSelectHandle={({ isKill, isSelect, index }) => this.listSelectHandle({ isKill, isSelect, index })} data={selectList} />
            <ResultList data={resultList} unSelectResult={item => this.unSelectResult(item)} />
        </div>
    }
}

class FastSelectCheckbox extends Utils {
    constructor(props) {
        super(props)
    }

    render() {
        const { fastSelectHandle } = this.props
        return <div className="multiple-select-fast">
            <Checkbox
                key="multiple-select"
                name='全选'
                callBackHandle={fastSelectHandle}
            />
        </div>
    }
}

const SelectList = ({ data, listSelectHandle }) => <div className="multiple-select-list">
    {data.map((item, key) => <Checkbox key={key}
        name={item.lable}
        haveDisable
        isKill={item.isKill}
        isSelect={item.isSelect}
        callBackHandle={({ isDisable, isSelect }) => listSelectHandle({ isKill: isDisable, isSelect, index: key })}
    />)}
</div>

class ResultList extends Utils {
    constructor(props) {
        super(props)
    }

    render() {
        const { data, unSelectResult } = this.props
        return <div className="multiple-select-result">
            {data.filter(({ isKill, isSelect }) => !isKill && !!isSelect)
                .map((item, key) => <div key={key} className="multiple-result-container">
                    <div className="multiple-result-item"
                        onClick={() => unSelectResult(item)}
                    >{item.lable}</div>
                </div>)}
        </div>
    }
}

class Checkbox extends Utils {
    constructor(props) {
        super(props)
        this.state = {
            isSelect: false,
            isDisable: false
        }
    }

    render() {
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

const openMultipleSelect = tagSelected => new Promise(resolve => {
    const myMultipleSelectRef = React.createRef();
    const div = document.createElement('div')
    document.body.appendChild(div)

    const cancelHandle = () => {
        document.body.removeChild(div)
        resolve(consequencer.error('cancel'))
    }

    const confirmHandle = () => {
        const selected = myMultipleSelectRef.current.getSelectedResult().map(({ value }) => value)
        document.body.removeChild(div)
        resolve(consequencer.success(selected))
    }

    ReactDOM.render(
        <Modal
            visible
            cancelHandle={cancelHandle}
            confirmHandle={confirmHandle}
        >
            <MultipleSelectLayout ref={myMultipleSelectRef}
                selected={tagSelected}
            />
        </Modal>,
        div
    )
})

export default openMultipleSelect
