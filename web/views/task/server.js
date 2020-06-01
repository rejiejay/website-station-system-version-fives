import fetch from './../../components/async-fetch/fetch.js';
import jsonHandle from './../../utils/json-handle.js';

let server = {}

/**
 * 含义: 获取缓存任务
 */
server.getStorageTask = async() => {
    let task = false
    await fetch.get({
        url: 'map/get',
        query: { key: 'progress-task' }
    }).then(
        ({ data }) => task = data,
        error => {}
    )

    if (!task) return task

    /** 判断缓存数据格式是否正确 */
    const taskVerify = jsonHandle.verifyJSONString({ jsonString: task })
    if (!taskVerify.isCorrect) return task

    return taskVerify.data
}

/**
 * 含义: 获取任务的其他信息
 */
server.getJsonDataBySMART = task => {
    let smart = {
        specific: '',
        measurable: '',
        attainable: '',
        relevant: '',
        timeBound: ''
    }

    if (!task) return smart
    const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: task })
    if (!verifyJSONresult.isCorrect) return smart
    const result = verifyJSONresult.data
    if (result.specific) smart.specific = result.specific
    if (result.measurable) smart.measurable = result.measurable
    if (result.attainable) smart.attainable = result.attainable
    if (result.relevant) smart.relevant = result.relevant
    if (result.timeBound) smart.timeBound = result.timeBound

    return smart
}

/**
 * 含义: 获取任务的其他信息
 */
server.updateSMARThandle = ({ smart, key, value }) => {
    smart[key] = value
    return JSON.stringify(smart)
}

export default server