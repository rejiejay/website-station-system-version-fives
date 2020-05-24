import fetch from './../../../components/async-fetch/fetch.js';
import jsonHandle from './../../../utils/json-handle.js';
import { queryToUrl, parseQueryString } from './../../../utils/url-handle.js';

import CONST from './const.jsx';

class DateSelection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: CONST.DATA.DEFAULTS
        }

        this.callbackUrl = ''
    }

    async componentDidMount() {
        await this.initList()
    }

    async initList() {
        const self = this

        const fetchStatisticsTime = async () => await fetch.get({
            url: 'record/statistics/time',
            query: {}
        }).then(
            ({ data: { statistics, expiredTimestamp } }) => {
                self.setState({ list: statistics })
                window.localStorage['website-station-system-record-statistics-time'] = JSON.stringify({ time: statistics, expiredTimestamp })
            },
            error => { }
        )

        /** 判断是否有缓存数据 */
        const statisticString = window.localStorage['website-station-system-record-statistics-time']
        if (!statisticString || statisticString == 'null') return await fetchStatisticsTime()

        /** 判断缓存数据格式是否正确 */
        const statisticVerify = jsonHandle.verifyJSONString({ jsonString: statisticString })
        if (!statisticVerify.isCorrect) return await fetchStatisticsTime()

        /** 判断是否过期 */
        const statistics = statisticVerify.data
        const nowTimestamp = new Date().getTime()
        if (nowTimestamp > statistics.expiredTimestamp) return await fetchStatisticsTime()

        return self.setState({ list: statistics.time })
    }

    renderList() {
        const self = this
        const { list } = this.state

        const switchChildrenHandle = key => {
            let myList = JSON.parse(JSON.stringify(list))

            if (list[key].hasOwnProperty('isShowChildren') && list[key].isShowChildren) {
                myList[key].isShowChildren = false
            } else {
                myList[key].isShowChildren = true
            }

            self.setState({ list: myList })
        }

        return list.map(({ count, children, maxTimestamp, minTimestamp, name, isShowChildren }, key) => [
            <div className="date-item flex-start-center" key={key}>
                <div className="item-name flex-rest"
                    onClick={() => self.selectHandle(maxTimestamp, minTimestamp)}
                >{name}</div>
                <div className="item-count">{count}</div>
                {!!children &&
                    <div className="item-icon flex-center"
                        onClick={() => switchChildrenHandle(key)}
                    >{!!isShowChildren ? CONST.ICON.MINIFY : CONST.ICON.BLOW_UP}
                    </div>
                }
            </div>,

            !!children && !!isShowChildren && self.renderListChildren(children, `${key}`)
        ])
    }

    renderListChildren(upLevelList, upLevelKey) {
        const self = this
        const { list } = this.state

        const getTargetItem = originData => {
            const depth = upLevelKey.split(',')
            const depthList = []

            const firstKey = depth[0]
            const firstData = originData[firstKey]
            depthList.push(firstData)

            for (let i = 1; i < depth.length; i++) {
                const thisDepthData = depthList[depthList.length - 1]
                const thisDepthKey = depth[i]
                depthList.push(thisDepthData.children[thisDepthKey])
            }

            const finallyDepthData = depthList[depthList.length - 1]

            return finallyDepthData.children
        }

        const switchChildrenHandle = key => {
            let myList = JSON.parse(JSON.stringify(list))

            const item = getTargetItem(list)

            if (item[key].hasOwnProperty('isShowChildren') && item[key].isShowChildren) {
                getTargetItem(myList)[key].isShowChildren = false
            } else {
                getTargetItem(myList)[key].isShowChildren = true
            }

            self.setState({ list: myList })
        }

        return upLevelList.map(({ count, children, maxTimestamp, minTimestamp, name, isShowChildren }, key) => [
            <div className="date-item flex-start-center" key={key}>
                <div className="item-name flex-rest"
                    onClick={() => self.selectHandle(maxTimestamp, minTimestamp)}
                >{name}</div>
                <div className="item-count">{count}</div>
                {!!children &&
                    <div className="item-icon flex-center"
                        onClick={() => switchChildrenHandle(key)}
                    >{!!isShowChildren ? CONST.ICON.MINIFY : CONST.ICON.BLOW_UP}
                    </div>
                }
            </div>,

            !!children && !!isShowChildren && self.renderListChildren(children, `${upLevelKey},${key}`)
        ])
    }

    selectHandle(maxTimestamp, minTimestamp) {
        let callbackQuery = parseQueryString()
        delete callbackQuery.tag
        delete callbackQuery.type
        delete callbackQuery.search
        callbackQuery.maxTimestamp = maxTimestamp
        callbackQuery.minTimestamp = minTimestamp

        window.location.replace(`../index.html${queryToUrl(callbackQuery)}`)
    }

    render() {

        return [
            <div className="close">
                <div className="close-container flex-center"
                    onClick={() => selectHandle('', '')}
                >关闭</div>
            </div>,

            <div className="date">{this.renderList.call(this)}</div>
        ]
    }
}

window.onload = () => ReactDOM.render(<DateSelection />, document.body);
