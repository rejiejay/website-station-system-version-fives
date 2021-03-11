import Modal from './../../modal/index.jsx';
import consequencer from './../../../utils/consequencer.js';
import popupStyle from './../style.jsx';

const AlertPopup = message => new Promise(resolve => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const confirmHandle = () => {
        document.body.removeChild(div)
        resolve(consequencer.success())
    }

    ReactDOM.render(
        <Modal
            visible
            confirmHandle={confirmHandle}
        >
            <div className="flex-center" style={popupStyle.container}>
                <div style={popupStyle.message}>{message}</div>
            </div>
        </Modal>,
        div
    )
})

export default AlertPopup
