import AlertPopup from './../alert/index.jsx';
import consequencer from './../../../utils/consequencer.js';

const ReGetSuccess = fetchHandle => new Promise(resolve => {
    const reFetchHandle = async () => {
        const fetchInstance = await fetchHandle()
        if (fetchInstance.result === 1) return resolve(consequencer.success())
        await AlertPopup(fetchInstance.message)
        reFetchHandle()
    }

    reFetchHandle()
})

export default ReGetSuccess
