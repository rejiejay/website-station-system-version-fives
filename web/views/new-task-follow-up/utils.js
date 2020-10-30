/**
 * @param putOff {string} 
 */
const timeCategoryToTimestamp = putOff => {
    if (putOff === 'today') return 1000 * 60 * 60 * 24
    if (putOff === 'recently') return 1000 * 60 * 60 * 24 * 3
    if (putOff === 'week') return 1000 * 60 * 60 * 24 * 7
    if (putOff === 'month') return 1000 * 60 * 60 * 24 * 30
    if (putOff === 'season') return 1000 * 60 * 60 * 24 * 30 * 3
    return null
}

const getTodayGroupTaskRootId = async() => {}

const utils = {
    timeCategoryToTimestamp,
    getTodayGroupTaskRootId
}

export default utils