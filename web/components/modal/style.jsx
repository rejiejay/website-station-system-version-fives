import basicFlex from './../../css/jsx-style/basic-flex.jsx';

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
        overflow: 'auto'
    }

    if (isFullScreen) return {
        ...base,
        width: '100%',
        height: '100%'
    }
    return {
        ...base,
        minWidth: '160px',
        minHeight: '120px'
    }
}

const style = {
    modal,
    mask,
    container
}

export default style
