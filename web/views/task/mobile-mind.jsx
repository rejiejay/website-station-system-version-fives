import fetch from './../../components/async-fetch/fetch.js';

import CONST from './const.js';

export default class MobileMindComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth

        this.taskMindData = CONST.MIND_FORMAT
        this.jsMindInstance = null

        this.resolve = null
        this.reject = null
    }

    async initMindByRootId(rootid) {
        const self = this

        await fetch.get({
            url: 'task/list/group/by',
            query: { rootid }
        }).then(
            ({ data }) => {
                const rootMind = data.filter(task => task.parentid === 'root')[0]
                const mind = data.filter(task => task.parentid !== 'root')

                self.taskMindData.meta.name = rootMind.title
                self.taskMindData.data = [{
                    isroot: true,
                    id: rootMind.id,
                    topic: rootMind.title
                }].concat(mind.map(task => ({
                    id: +task.id,
                    parentid: +task.parentid,
                    topic: task.title,
                    putoff: task.putoff,
                    direction: 'right',
                    expanded: true
                })))
            },
            error => { }
        )

        document.getElementById('jsmind_container').innerHTML = ''
        this.jsMindInstance = new jsMind({
            container: 'jsmind_container',
            editable: true,
            theme: CONST.MIND_THEME.PRIMARY
        })

        this.jsMindInstance.show(this.taskMindData);

        const selectNodeHandle = node => {
            const data = self.jsMindInstance.get_node(node)

            const { resolve } = self
            document.getElementById('jsmind').style.display = "none";
            resolve ? resolve(data.id) : null
        }

        this.jsMindInstance.add_event_listener((type, { evt, node }) => {
            if (type === 4 && evt === 'select_node') selectNodeHandle(node)
        });
    }

    selectNode() {
        const self = this
        const { rootId } = this.props
        document.getElementById('jsmind').style.display = "block";
        this.initMindByRootId(rootId)

        return new Promise((resolve, reject) => {
            self.resolve = resolve
            self.reject = reject
        })
    }

    selectNodeByRootId(rootid) {
        const self = this
        document.getElementById('jsmind').style.display = "block";
        this.initMindByRootId(rootid)

        return new Promise((resolve, reject) => {
            self.resolve = resolve
            self.reject = reject
        })
    }

    closeHandle() {
        const { reject } = this
        document.getElementById('jsmind').style.display = "none";
        reject ? reject() : null
    }

    render() {
        const self = this
        const { clientHeight, clientWidth } = this

        return (<div className="mobile-mind" id="jsmind" style={{ height: clientWidth, width: clientHeight, top: (clientHeight - clientWidth) / 2, left: 0 - (clientHeight - clientWidth) / 2 }}>
            <div className="operation">
                <div className="operation-container flex-start">
                    <div className="operation-item">
                        <div className="operation-item-container flex-center noselect"
                            onClick={this.closeHandle.bind(this)}
                        >关闭</div>
                    </div>
                </div>
            </div>

            <div className="mind" id="jsmind_container"></div>
        </div>)
    }
}

