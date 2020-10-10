const Modal = ({ visible, isFullScreen, maskClosable, closHandle, confirmHandle, cancelHandle, children }) => {
    if (!visible) return <></>

    const { haveCloseIcon, haveConfirm, haveCancel, haveFooter } = utils.judgment({ confirmHandle, cancelHandle, closHandle })

    return <div className="react-basic-modal">
        {!isFullScreen && <div className="basic-modal-mask" onClick={() => utils.runCloseFun({ maskClosable, closHandle })}></div>}
        <div className="basic-modal-container" style={utils.renderStyle(isFullScreen)}>
            <div className="basic-modal-children">
                {children}
            </div>
            {haveCloseIcon && <div className="basic-modal-close" onClick={closHandle} >X</div>}
            {haveFooter && <div className="basic-modal-footer">
                {haveConfirm && <ButtonFooter key="confirm" className="modal-footer-confirm" click={confirmHandle}>确认</ButtonFooter>}
                {haveCancel && <ButtonFooter key="cancel" className="modal-footer-cancel" click={cancelHandle}>取消</ButtonFooter>}
            </div>}
        </div>
    </div>
}

// for Reserved, because Not Test-Case effect
const BasicFooter = () => [
    <div style={{ height: `${45}px` }} />,
    <div className="basic-modal-footer">
        <div className="modal-footer-confirm">取消</div>
        <div className="modal-footer-cancel">确认</div>
    </div>
]

const ButtonFooter = ({ className, click, children }) => <div className={className}
    onClick={click}
>
    <div className="footer-button-container">{children}</div>
</div>

function judgment({ confirmHandle, cancelHandle, closHandle }) {
    const haveConfirm = this.unNilFun(confirmHandle)
    const haveCancel = this.unNilFun(cancelHandle)
    const haveFooter = haveConfirm || haveCancel
    return {
        haveCloseIcon: this.unNilFun(closHandle),
        haveConfirm,
        haveCancel,
        haveFooter,
    }
}

function runCloseFun({ maskClosable, closHandle }) {
    if (maskClosable && this.unNilFun(closHandle)) closHandle()
}

function renderStyle(isFullScreen) {
    if (isFullScreen) return {
        width: '100%',
        height: '100%',
    }
    return {
        minWidth: '160px',
        minHeight: '120px',
    }
}

const utils = {
    unNilFun: fun => fun && typeof fun === 'function',

    runCloseFun,

    judgment,

    renderStyle,
}

export default Modal