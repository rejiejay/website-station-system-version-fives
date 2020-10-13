import Modal from './../../modal/index.jsx';
import style from './style.jsx';

// it can abstract
const renderReactDOM = () => { }
const closeReactDOM = () => { }

const AlertPopup = message => new Promise(resolve => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const closHandle = () => resolve()
    const confirmHandle = () => resolve()

    ReactDOM.render(
        <Modal
            visible
            closHandle={closHandle}
            confirmHandle={confirmHandle}
        >
            <div style={style.container}>{message}</div>
        </Modal>,
        div,
    )
})

export default AlertPopup
