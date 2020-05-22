import fetch from './../../components/async-fetch/fetch.js';
import jsonHandle from './../../utils/json-handle.js';

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

export default server