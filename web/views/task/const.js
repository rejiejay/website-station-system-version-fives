const CONST = {
    TASK: {
        DEFAULT_LIST: [],
        DEFAULT_ITEM: null,
        TASK_LIST_DEMO: [{
            id: 1,
            parentid: 'root', // parentid = root 表示 isroot
            rootid: '', // 主要   方便SQL查询
            title: '',
            content: '',
            /** S=Specific、M=Measurable、A=Attainable、R=Relevant、T=Time-bound */
            SMART: '',
            /** 作用: 绑定结论 */
            link: '',
            timestamp: 1590495644334,
            putoff: 1590495644334,
            complete: 1590495644334
        }],
        ROOT_TASK_LIST_DEMO: [{
            id: '1590495744334',
            parentid: 'root',
            rootid: '1590495744334'
        }],
        TASK_MIND_LIST_DEMO: [{
            id: '1590495744334',
            parentid: 'root',
            rootid: '1590495744334',
            topic: '',
            direction: 'right',
            expanded: true
        }]
    },

    FILTER: {
        DEFAULT: null,
        DEMO: {
            id: 0,
            label: '过滤名称'
        }
    },

    MIND_FORMAT: {
        meta: { name: "jsMind", author: "hizzgdev@163.com", version: "0.4.6" },
        format: "node_array",
        format: 'node_array',
        data: []
    },

    MIND_THEME: {
        PRIMARY: 'primary',
        WARNING: 'warning',
        DANGER: 'danger',
        SUCCESS: 'success',
        INFO: 'info',
        GREENSEA: 'greensea',
        NEPHRITE: 'nephrite',
        BELIZEHOLE: 'belizehole',
        WISTERIA: 'wisteria',
        ASPHALT: 'asphalt',
        ORANGE: 'orange',
        PUMPKIN: 'pumpkin',
        POMEGRANATE: 'pomegranate',
        CLOUDS: 'clouds',
        ASBESTOS: 'asbestos'
    }
}

export default CONST