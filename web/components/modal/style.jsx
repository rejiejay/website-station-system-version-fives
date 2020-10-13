import basicFlex from './../../css/jsx-style/basic-flex.jsx';
import client from './../../css/jsx-style/client.jsx';

const modal = (zIndex = 99) => ({
    ...basicFlex.center,
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0px',
    left: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    zIndex
})

const mask = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '0px',
    left: '0px',
    opacity: 0
}

const container = isFullScreen => {
    const base = {
        position: 'relative',
        backgroundColor: '#fff',
        wordWrap: 'break-word'
    }

    if (isFullScreen) return {
        ...base,
        width: '100%',
        height: '100%'
    }
    return {
        ...base,
        height: client.heightPercentagePx(0.7),
        width: client.widthPercentagePx(0.7),
    }
}

const children = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden scroll'
}

const close = {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '15px',
    height: '15px',
    top: '0px',
    right: '0px',
}

const footer = {
    position: 'absolute',
    width: '100%',
    height: '45px',
    left: '0px',
    bottom: '0px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff',
}

const footerButton = {
    lineHeight: '45px',
}

const style = {
    modal,
    mask,
    container,
    children,
    close,
    footer,
    footerButton
}

export default style
