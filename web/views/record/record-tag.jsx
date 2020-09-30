import React, { useState, memo } from 'react'
import ReactDOM from 'react-dom'

import './record-tag.less'

export default class RecordTag extends React.Component {
    constructor(props) { 
        super(props) 
        this.state = { } 
    } 

	componentDidMount () {
        openMultipleSelect()
    }

	render () {
		return [
            <div key="123">1321312</div>
        ]
	}
}

const openMultipleSelect = () => new Promise(resolve => {
    const div = document.createElement('div')
    document.body.appendChild(div);

    const multipleSelecRef = React.createRef()

    function close() {
        ReactDOM.unmountComponentAtNode(div);
        if (div && div.parentNode) div.parentNode.removeChild(div);
        resolve(consequencer.error())
    }

    const confirmHandle = () => {
        const result = multipleSelecRef.current.getSelectedResult()
        resolve(consequencer.success(result))
    }

    ReactDOM.render(
        <Modal
            visible
            maskClosable={false}
            closHandle={close}
            confirmHandle={confirmHandle}
            cancelHandle={close}
        >
            <MultipleSelectLayout ref={multipleSelecRef} />
        </Modal>,
        div,
    );
})

const Modal = ({ visible, maskClosable, closHandle, confirmHandle, cancelHandle, children }) => {
    if (!visible) return <></>

    const unNilFun = fun => fun && typeof fun === 'function'

    const haveConfirm = unNilFun(confirmHandle)
    const haveCancel = unNilFun(cancelHandle)
    const haveFooter = haveConfirm || haveCancel

    const ButtonFooter = ({ className, click, children }) => <div className={className}
        onClick={click}
    >
        <div className="footer-button-container">{children}</div>
    </div>

    return (
        <div className="react-basic-modal">
            <div className="basic-modal-mask" onClick={() => maskClosable && unNilFun(closHandle) && closHandle()}></div>
            <div className="basic-modal-container">
                <div className="basic-modal-children">
                    {children}
                </div>
                {unNilFun(closHandle) && <div className="basic-modal-close" onClick={closHandle} >X</div>}
                {haveFooter && <div className="basic-modal-footer">
                    {haveConfirm && <ButtonFooter key="confirm" className="modal-footer-confirm" click={confirmHandle}>确认</ButtonFooter>}
                    {haveCancel && <ButtonFooter key="cancel" className="modal-footer-cancel" click={cancelHandle}>取消</ButtonFooter>}
                </div>}
            </div>
        </div>
    );
}

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

class MultipleSelectLayout extends React.Component {
    constructor(props) { 
        super(props) 
        this.state = {
            selectList: CONST.MULTIPLE_SELECT.DEFAULT
        } 
    } 

	componentDidMount () {
        const selectList = [
            { isKill: false, isSelect: false, value: '1', lable: 'a' },
            { isKill: false, isSelect: false, value: '2', lable: 'b' },
            { isKill: false, isSelect: false, value: '3', lable: 'c' },
            { isKill: false, isSelect: false, value: '4', lable: 'd' },
        ]
        this.setState({ selectList })
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

    unSelectResult(result) {
        this.setState({ selectList: this.state.selectList.map(item => {
            if (result.lable === item.lable && result.value === item.value) return { ...item, isSelect: false  }
            return item
        }) })
    }

	render () {
        const { selectList } = this.state
        const resultList = this.getSelectedResult()

        return <div className="multiple-select">
            <FastSelectCheckbox fastSelectHandle={({ isSelect }) => this.fastSelectHandle({ isSelect })} />
            <SelectList listSelectHandle={({ isKill, isSelect, index }) => this.listSelectHandle({ isKill, isSelect, index })} data={selectList} />
            <ResultList data={resultList} unSelectResult={item => this.unSelectResult(item)} />
        </div>
	}
}

class FastSelectCheckbox extends React.Component {
    constructor(props) { 
        super(props) 
    }
	render () {
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

class ResultList extends React.Component {
    constructor(props) { 
        super(props) 
    }
	render () {
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

class Checkbox extends React.Component {
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

const consequencer = {
    success: (data, message) => ({
        result: 1,
        data: data || null,
        message: message || 'success'
    }),
    error: (message, result, data) => ({
        result: result || 0,
        data: data || null,
        message: message
    })
}
