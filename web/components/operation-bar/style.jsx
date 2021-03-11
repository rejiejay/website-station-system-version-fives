const main = isAbsolute => {
    return {
        position: isAbsolute ? 'absolute' : 'fixed',
        bottom: '0px',
        left: '0px',
        height: '45px',
        width: '100%',
        borderTop: '1px solid #ddd',
        background: '#fff',
        fontSize: '12px'
    }
}

const leftItem = {
    padding: '0px 7.5px',
    height: '25px',
    borderRight: '1px solid #ddd'
}

const rightItem = {
    padding: '0px 7.5px',
    height: '25px',
    borderLeft: '1px solid #ddd'
}

const style = {
    main,
    leftItem,
    rightItem
}

export default style
