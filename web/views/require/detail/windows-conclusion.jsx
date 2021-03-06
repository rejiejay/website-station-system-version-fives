import jsonHandle from './../../../utils/json-handle.js';
import { inputPopUp, inputPopUpDestroy } from './../../../components/input-popup.js';
import { confirmPopUp } from './../../../components/confirm-popup/index.js';
import DropDownSelect from './../../../components/drop-down-select-tooltip.jsx';

import CONST from './const.js';

let self = null

/**
 * 含义: 判断是否多功能页面
 */
const isMultifunction = verifyJSOresult => {
    const { isShowMultifunction } = self.state

    if (!verifyJSOresult.isCorrect) return false
    if (!isShowMultifunction) return false
    if (!!verifyJSOresult.data && !!verifyJSOresult.data.content) return true
    return false
}

const addMultiItem = data => {
    const inputHandle = multiContent => {
        const multiItem = CONST.MULTI_FUNCTION_ITEM.DEFAULTS
        multiItem.content = multiContent

        if (!!data.child && data.child instanceof Array) {
            data.child.push(multiItem)
        } else {
            data.child = [multiItem]
        }

        self.setState({ content: JSON.stringify(data) })

        inputPopUpDestroy()
    }

    inputPopUp({
        title: '请输要新增的结论',
        inputHandle,
        mustInput: false
    })
}

const bindUrlMultiItem = (data, item, index, defaultValue) => {
    const bindUrl = item.bindUrl
    const inputHandle = url => {
        data.child[index].bindUrl = url
        self.setState({ content: JSON.stringify(data) })
        inputPopUpDestroy()
    }

    let popupConfiguration = {
        title: '请输要绑定的链接',
        inputHandle,
        mustInput: false
    }

    if (defaultValue || bindUrl) popupConfiguration.defaultValue = defaultValue || bindUrl
    inputPopUp(popupConfiguration)
}

const selectUrlMultiItem = ({ value, label }, data, item, index) => {
    let defaultValue = ''
    if (value === CONST.MULTI_FUNCTION_BIND_URL_TYPE.RECORD.value) {
        defaultValue = `${CONST.MULTI_FUNCTION_BIND_URL_TYPE.RECORD.url}?tag=`
    }
    if (value === CONST.MULTI_FUNCTION_BIND_URL_TYPE.TASK.value) {
        defaultValue = `${CONST.MULTI_FUNCTION_BIND_URL_TYPE.TASK.url}?type=task_list&id=`
    }
    bindUrlMultiItem(data, item, index, defaultValue)
}

const delMultiItem = (data, index) => confirmPopUp({
    title: `你确定要删除吗?`,
    succeedHandle: () => {
        data.child.splice(index, 1)
        self.setState({ content: JSON.stringify(data) })
    }
})

const onChangeMultiHandle = (data, value) => {
    data.content = value
    self.setState({ content: JSON.stringify(data) })
}

const changeMultiItemHandle = (data, value, index) => {
    data.child[index].content = value
    self.setState({ content: JSON.stringify(data) })
}

const renderConclusion = _this => {
    self = _this
    const { content } = self.state

    const verifyJSOresult = jsonHandle.verifyJSONString({ jsonString: content })

    /**
     * 渲染正常的结论页面
     */
    if (isMultifunction(verifyJSOresult) === false) return [
        <div className="edit-mind-description multi-function flex-start">
            <div className="flex-rest">策略结论</div>
            {verifyJSOresult.isCorrect && <div className="multi-function-add"
                onClick={() => self.setState({ isShowMultifunction: true })}
            >展示JSON</div>}
            {!verifyJSOresult.isCorrect && <div className="multi-function-add"
                onClick={() => self.setState({ content: JSON.stringify({ content }) })}
            >展示JSON</div>}
        </div>,
        <div className="content-input">
            <textarea className="content-textarea fiex-rest" type="text"
                placeholder="请输入结论"
                value={content}
                style={{ height: 180 }}
                onChange={({ target: { value } }) => self.setState({ content: value })}
            ></textarea>
        </div>
    ]

    /**
     * 含义: 渲染带功能的结论
     */
    const data = verifyJSOresult.data
    return [
        <div className="edit-mind-description multi-function flex-start">
            <div className="flex-rest">策略结论</div>
            <div className="multi-function-add"
                onClick={() => addMultiItem(data)}
            >新增</div>
            <div className="multi-function-add"
                onClick={() => self.setState({ isShowMultifunction: false })}
            >隐藏JSON</div>
        </div>,

        data && data.child && data.child.map((item, key) =>
            <div className="multi-function-item flex-start-center noselect" key={key}>
                <input type="text" placeholder="请输入策略"
                    value={item.content}
                    onChange={({ target: { value } }) => changeMultiItemHandle(data, value, key)}
                />
                {!!item.bindUrl && <div className="multifunction-item-jump flex-center"
                    onClick={() => window.location.replace(item.bindUrl)}
                >跳转</div>}
                {!!item.bindUrl && <div className="multifunction-item-bind flex-center"
                    onClick={() => bindUrlMultiItem(data, item, key)}
                >bindUrl</div>}
                {!item.bindUrl && <DropDownSelect
                    options={[CONST.MULTI_FUNCTION_BIND_URL_TYPE.RECORD, CONST.MULTI_FUNCTION_BIND_URL_TYPE.TASK]}
                    handle={({ value, label }) => selectUrlMultiItem({ value, label }, data, item, key)}
                >
                    <div className="multifunction-item-bind flex-center">bindUrl</div>
                </DropDownSelect>}
                <div className="multifunction-item-del flex-center"
                    onClick={() => delMultiItem(data, key)}
                >删除</div>
            </div>
        ),

        <div className="content-input">
            <textarea className="content-textarea fiex-rest" type="text"
                placeholder="请输入结论"
                value={data.content}
                style={{ height: 180 }}
                onChange={({ target: { value } }) => onChangeMultiHandle(data, value)}
            ></textarea>
        </div>
    ]
}

export default renderConclusion