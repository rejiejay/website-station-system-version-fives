import TemporaryStorage from './../../utils/temporary-storage.jsx';

const getClien = (field, defaultValue) => {
    if (window.document.body && window.document.body[`offset${field}`]) return window.document.body[`offset${field}`]
    if (window.document.documentElement && window.document.documentElement[`client${field}`]) return window.document.documentElement[`client${field}`]
    if (window.document[`inner${field}`]) return window.document[`inner${field}`]
    return defaultValue
}

const getClientHeight = () => getClien('Height', 667)
const getClientWidth = () => getClien('Width', 375)

const clientHeight = new TemporaryStorage(getClientHeight, 3600000)
const clientWidth = new TemporaryStorage(getClientWidth, 3600000)

const client = {
    height: () => clientHeight.get(),
    width: () => clientWidth.get(),
    heightPercentagePx: (percentage) => `${Math.floor(clientHeight.get() * percentage)}px`,
    widthPercentagePx: (percentage) => `${Math.floor(clientWidth.get() * percentage)}px`,
    heightPx: () => `${clientHeight.get()}px`,
    widthPx: () => `${clientWidth.get()}px`
}

export default client
