import CONST from './const.js';

export const mindSelectPopup = {
    getFullScreen() {
        const isFullScreen = localStorage.getItem(CONST.MIND_FULL_SCREEN)
        if (isFullScreen === 'true') return true
        return false
    }
}