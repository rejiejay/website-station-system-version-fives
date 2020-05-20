import fetch from './../../components/async-fetch/fetch.js';
import { confirmPopUp } from './../../components/confirm-popup.js';
import jsonHandle from './../../utils/json-handle.js';

import CONST from './const.js';

export default class WindowsItemDetailComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    initByRandom() {
        const { self } = this.props
        const { tag, type } = self.state

        fetch.get({
            url: 'record/get/random',
            query: { size: 1, tag, type }
        }).then(
            ({ data }) => (data && data.length > 0) ? self.setState({ detail: data[0] }) : null,
            error => { }
        )
    }

    navigateToDetail() {
    }

    delDetailHandle() {
        const { self, data } = this.props

        const handle = () => {
            fetch.post({
                url: 'record/del/id',
                body: { id: data.id }
            }).then(
                ({ data }) => self.initData(),
                error => { }
            )
        }

        confirmPopUp({
            title: '你确定要删除这条数据吗?',
            succeedHandle: handle
        })
    }

    static detailToDiary(detail) {
        if (!detail || !detail.content) return []

        const diaryString = detail.content
        const diaryVerify = jsonHandle.verifyJSONString({ jsonString: diaryString })
        if (!diaryVerify.isCorrect) return []

        const diary = diaryVerify.data
        const format = CONST.DATA_FORMAT.diary

        return Object.keys(format).map(key => ({
            title: format[key],
            description: diary[key] ? diary[key] : false
        }))
    }

    render() {
        const { data, children, className, style } = this.props

        return (
            <div className={className}>
                <div className="content-detail-container " style={style}>

                    {data && <div className="detail-preview">
                        {data.type === CONST.DATA_TYPE.RECORD.value && children.recordNode}
                        {data.type === CONST.DATA_TYPE.DIARY.value && children.diaryNode}
                    </div>}

                    <div className="detail-operate flex-start-center noselect">
                        {children.operateNode}
                    </div>
                </div>
            </div>
        )
    }
}
