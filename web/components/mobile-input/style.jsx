import basicFlex from './../../css/jsx-style/basic-flex.jsx';
import client from './../../css/jsx-style/client.jsx';

const inputTitleStyle = isRequiredHighlight => {
    const style = {
        fontSize: '16px',
        padding: '10px 15px 5px',
    }
    if (isRequiredHighlight) style.color = '#f5222d'
    return style
}

const inputArea = {
    padding: '5px 15px 15px'
}

const baseInput = () => ({
    border: '1px solid #ddd',
    color: '#606266',
    padding: '5px 10px',
    width: '100%',
    background: '#fff'
})

function inputTheme() {
    return {
        ...this.baseInput(),
        height: '35px',
        fontSize: '16px',
        lineHeight: '35px',
    }
}

function inputTextarea(height, isAutoHeight, value) {
    let style = this.baseInput()

    if (isAutoHeight) {
        const wrapConut = value ? value.split(/[\s\n]/).length : 1
        const wrapHeight = wrapConut * 16

        if (height) style.minHeight = `${height}px`
        style.height = `${height ? (height + wrapHeight - 16) : wrapHeight}px`

        return style
    }

    height ? style.height = `${height}px` : style.minHeight = '45px'

    return style
}

const style = {
    inputTitleStyle,
    inputArea,
    baseInput,
    inputTheme,
    inputTextarea
}

export default style
