import consequencer from './../../../utils/consequencer.js';
import style from './style.jsx';

class Utils extends React.Component {
    constructor(props) {
        super(props)
    }
}

class ActionSheet extends Utils {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { title, options, selectHandle, cancelHandle } = this.props

        return <></>
    }
}

const ActionSheetPopup = ({ title, options }) => new Promise(resolve => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const cancelHandle = () => {
        document.body.removeChild(div)
        resolve(consequencer.error('cancel'))
    }

    const confirmHandle = ({ value, label }) => {
        document.body.removeChild(div)
        resolve(consequencer.success({ value, label }))
    }

    ReactDOM.render(
        <ActionSheet
            title={title}
            options={options}
            selectHandle={confirmHandle}
            cancelHandle={cancelHandle}
        />,
        div
    )
})

export default ActionSheetPopup
