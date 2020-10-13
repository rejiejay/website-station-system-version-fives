import style from './style.jsx';

const Modal = ({ visible, isFullScreen, modalName, maskClosable, closHandle, confirmHandle, cancelHandle, children }) => {
    if (!visible) return <></>

    const { haveCloseIcon, haveConfirm, haveCancel, haveFooter } = utils.judgment({ confirmHandle, cancelHandle, closHandle })

    return <div className={`react-basic-modal ${modalName || ''}`} style={style.modal()}>
        {!isFullScreen && <div className="basic-modal-mask"
            style={style.mask}
            onClick={() => utils.runCloseFun({ maskClosable, closHandle })}
        />}
        <div className="basic-modal-container" style={style.container(isFullScreen)}>
            <div className="basic-modal-children" style={style.children}>
                {children}
                {haveFooter && <div style={{ height: '45px' }}></div>}
            </div>
            {haveCloseIcon && <div className="basic-modal-close"
                style={style.close}
                onClick={closHandle}
            >X</div>}
            {haveFooter && <div className="basic-modal-footer flex-start" style={style.footer}>
                {haveConfirm && <ButtonFooter key="confirm" className="modal-footer-confirm flex-rest flex-center"
                    click={confirmHandle}
                >确认</ButtonFooter>}
                {haveCancel && <ButtonFooter key="cancel" className="modal-footer-cancel flex-rest flex-center"
                    click={cancelHandle}
                >取消</ButtonFooter>}
            </div>}
        </div>
    </div>
}

const ButtonFooter = ({ className, click, children }) => <div className={className}
    style={style.footerButton}
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


const utils = {
    unNilFun: fun => fun && typeof fun === 'function',

    runCloseFun,

    judgment,
}

export default Modal