import ConfirmPopup from './../confirm/index.jsx';
import consequencer from './../../../utils/consequencer.js';

const ReGetConfirm = fetchHandle => new Promise(resolve => {
    const reFetchHandle = async () => {
        const fetchInstance = await fetchHandle()
        if (fetchInstance.result !== 1) {
            const confirmInstance = await ConfirmPopup(`获取失败, 原因稍后你将知道. 是否重新获取?`)
            if (confirmInstance.result === 1) return reFetchHandle()
            return resolve(consequencer.error(fetchInstance.message))
        }
        resolve(consequencer.success())
    }

    reFetchHandle()
})

export default ReGetConfirm
