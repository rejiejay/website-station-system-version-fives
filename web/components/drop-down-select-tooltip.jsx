import { createRandomStr } from './../utils/string-handle.js'

const CONSTS = {
    direction: {
        top: 'top',
        top: 'top-start',
        top: 'top-end',
        right: 'right',
        right_start: 'right-start',
        right_end: 'right-end',
        bottom: 'bottom',
        bottom_start: 'bottom-start',
        bottom_end: 'bottom-end',
        left: 'left',
        left_start: 'left-start',
        left_end: 'left-end',
        auto: 'auto',
        auto_start: 'auto-start',
        auto_end: 'auto-end',
    },

    options: {
        demo: [
            {
                value: 1,
                label: 'name'
            }
        ]
    }
}

const props = {
    options: CONSTS.options.demo,
    direction: CONSTS.direction.bottom_end,
    name: '',
    children: '',
    handle: () => { }
}

/**
 * 注意： 此组件必须引入
 * <script type="text/javascript" charset="utf-8" src="./lib/tippy/popper.min.js"></script>
 * <script type="text/javascript" charset="utf-8" src="./lib/tippy/tippy-bundle.umd.min.js"></script>
 */
export default class DropDownSelect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.componentReferId = createRandomStr({ length: 10 })
        this.tippyInstance = null
        this.needUpdateTippy = false
    }

    componentDidMount() {
        this.needUpdateTippy = true
    }

    componentDidUpdate(prevProps) {
        const { options } = this.props

        const isOptionsChange = () => {
            if (!prevProps) return true /** 含义：之前连props都没有 */
            if (!options || options.length <= 0) return false
            if (!prevProps.options) return true /** 含义：之前不存在值，现在存在值 */
            if (JSON.stringify(prevProps.options) === JSON.stringify(options)) return false
            return true
        }

        if (isOptionsChange()) {
            this.needUpdateTippy = true
        }
    }

    initSelectTooltip() {
        const self = this
        const { options, direction } = this.props
        const { componentReferId, needUpdateTippy } = this

        if (!options || options.length <= 0) return

        const node = document.createElement("div");
        node.setAttribute('class', 'drop-down-select-tooltip');
        node.setAttribute('id', 'drop-down-select-tooltip');
        const node_content = `<div class='tooltip-select-container'>
            ${options.map(({ value, label }) =>
            `<div class='tooltip-select-item flex-start-center'>${label}</div>`).join('')
            }
        </div>`;
        node.innerHTML = node_content;
        const init = () => {
            self.tippyInstance = tippy(`#tippy${componentReferId}`, {
                content: node,
                allowHTML: true,
                interactive: true,
                trigger: 'click',
                hideOnClick: 'toggle',
                zIndex: 1,
                placement: direction ? direction : CONSTS.direction.bottom_end,
                onShown(instance) {
                    self.bindDropDownSelectOnclick()
                }
            })
            self.needUpdateTippy = false
        }

        if (!this.tippyInstance || needUpdateTippy) {
            init()
            this.tippyInstance[0].show()
        }
    }

    bindDropDownSelectOnclick() {
        const { tippyInstance } = this
        const { options, handle } = this.props
        const tooltip_node = document.getElementById('drop-down-select-tooltip')
        const children_dom = tooltip_node.querySelectorAll('.tooltip-select-item')

        for (let index = 0; index < children_dom.length; index++) {
            const element = children_dom[index];
            const targetItem = options[index];
            element.onclick = () => {
                handle && handle(targetItem);
                tippyInstance[0].hide()
            }
        }
    }

    render() {
        const { componentReferId } = this
        const { name, children } = this.props

        return (
            <div className="drop-down-select-component flex-center"
                id={`tippy${componentReferId}`}
                onClick={this.initSelectTooltip.bind(this)}
            >{children ? children : name}</div>
        )
    }
}