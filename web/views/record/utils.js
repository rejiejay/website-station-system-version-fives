import CONST from './const.js';
import { loadPageVar } from './../../utils/url-handle.js';

export const initSort = () => {
    const defaultValue = CONST.SORT.DEFAULT.value
    const local = window.localStorage['website-station-system-record-sort']
    const pageVar = loadPageVar('sort')

    if (pageVar) {
        window.localStorage['website-station-system-record-sort'] = pageVar
        return pageVar
    }

    if (!!local && local !== 'null') return local

    return defaultValue
}

export const updateSort = ({ sort }) => window.localStorage['website-station-system-record-sort'] = sort