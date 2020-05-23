import fetch from './../../components/async-fetch/fetch.js';
import jsonHandle from './../../utils/json-handle.js';

import CONST from './const.js';

let server = {}

server.getTags = async({ isForceRefresh }) => {
    const fetchStatisticsTag = async() => {
        let myTags = []

        await fetch.get({
            url: 'record/statistics/tag',
            query: {}
        }).then(
            ({ data: { tags, expiredTimestamp } }) => {
                myTags = tags
                const statistic = JSON.stringify({ tags: tags, expiredTimestamp })
                window.localStorage['website-station-system-record-tags'] = statistic
            },
            error => {}
        )

        return myTags
    }

    if (isForceRefresh) return await fetchStatisticsTag()

    /** 判断是否有缓存数据 */
    const statisticString = window.localStorage['website-station-system-record-tags']
    if (!statisticString || statisticString == 'null') return await fetchStatisticsTag()

    /** 判断缓存数据格式是否正确 */
    const statisticVerify = jsonHandle.verifyJSONString({ jsonString: statisticString })
    if (!statisticVerify.isCorrect) return await fetchStatisticsTag()

    /** 判断是否过期 */
    const statistic = statisticVerify.data
    const nowTimestamp = new Date().getTime()
    if (nowTimestamp > statistic.expiredTimestamp) return await fetchStatisticsTag()

    return statistic.tags
}

server.getStatistics = async({ tag, type, minTimestamp, maxTimestamp, isForceRefresh }) => {
    const query = { tag, type, minTimestamp, maxTimestamp }

    const fetchStatisticsList = async() => {
        let statistics = 0

        await fetch.get({
            url: 'record/statistics/list',
            query
        }).then(
            ({ data: { count, expiredTimestamp } }) => {
                statistics = +count
                const statistic = JSON.stringify({ count: +count, expiredTimestamp })
                window.sessionStorage[`WebSS-record-${JSON.stringify(query)}`] = statistic
            },
            error => {}
        )

        return statistics
    }

    if (isForceRefresh) return fetchStatisticsList()

    /** 判断是否有缓存数据 */
    const statisticString = window.sessionStorage[`WebSS-record-${JSON.stringify(query)}`]
    if (!statisticString || statisticString == 'null') return fetchStatisticsList()

    /** 判断缓存数据格式是否正确 */
    const statisticVerify = jsonHandle.verifyJSONString({ jsonString: statisticString })
    if (!statisticVerify.isCorrect) return fetchStatisticsList()

    /** 判断是否过期 */
    const statistic = statisticVerify.data
    const nowTimestamp = new Date().getTime()
    if (nowTimestamp > statistic.expiredTimestamp) return fetchStatisticsList()

    return +statistic.count
}

server.getJsonByDataType = ({ type, content }) => {
    if (type === CONST.DATA_TYPE.DIARY.value) {
        const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: content })
        if (verifyJSONresult.isCorrect) {
            let diary = verifyJSONresult.data
            return diary
        } else {
            let diary = CONST.DATA_FORMAT.diary
            diary.clusion = content
            return diary
        }
    }

    return content
}

server.getImageArray = ({ imageArrayString }) => {
    const verifyJSONresult = jsonHandle.verifyJSONString({ jsonString: imageArrayString, isArray: true })
    if (!verifyJSONresult.isCorrect) return [];
    return verifyJSONresult.data
}

export default server