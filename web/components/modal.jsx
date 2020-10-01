const Modal = ({ visible, maskClosable, closHandle, confirmHandle, cancelHandle, children }) => {
    if (!visible) return <></>

    const unNilFun = fun => fun && typeof fun === 'function'

    const haveConfirm = unNilFun(confirmHandle)
    const haveCancel = unNilFun(cancelHandle)
    const haveFooter = haveConfirm || haveCancel

    const ButtonFooter = ({ className, click, children }) => <div className={className}
        onClick={click}
    >
        <div className="footer-button-container">{children}</div>
    </div>

    return (
        <div className="react-basic-modal">
            <div className="basic-modal-mask" onClick={() => maskClosable && unNilFun(closHandle) && closHandle()}></div>
            <div className="basic-modal-container">
                <div className="basic-modal-children">
                    {children}
                </div>
                {unNilFun(closHandle) && <div className="basic-modal-close" onClick={closHandle} >X</div>}
                {haveFooter && <div className="basic-modal-footer">
                    {haveConfirm && <ButtonFooter key="confirm" className="modal-footer-confirm" click={confirmHandle}>确认</ButtonFooter>}
                    {haveCancel && <ButtonFooter key="cancel" className="modal-footer-cancel" click={cancelHandle}>取消</ButtonFooter>}
                </div>}
            </div>
        </div>
    );
}

export default Modal