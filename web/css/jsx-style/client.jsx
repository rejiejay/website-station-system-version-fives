import TemporaryStorage from './../../utils/temporary-storage.jsx';

const getClientHeight = () => document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight;
const getClientWidth = () => document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth;

const clientHeight = new TemporaryStorage(getClientHeight, 216000)
const clientWidth = new TemporaryStorage(getClientWidth, 216000)

const client = {
    height: () => clientHeight.get(),
    width: () => clientWidth.get(),
    heightPx: () => `${clientHeight.get()}px`,
    widthPx: () => `${clientWidth.get()}px`
}

export default client
