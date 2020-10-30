const CONST = {
    SHOW_TASK_WAY: {
        DEFAULT: 'listAll',
        LIST_ALL: 'listAll', // default list all task
        LIST_MIND: 'listMind', // for list target group todo task
        MIND_TARGET_SELECT: 'mindTargetSelect', // for preview and select target group task
        MIND_DETAIL_SELECT: 'mindDetailSelect', // for same as listMind
    },

    LIST_SORT: {
        DEFAULT: 'time',
        TIME: 'time', // for view new task
        RANDOM: 'random', // for random view task
    },

    TASK_LIST_STATUS: {
        DEFAULT: 'hiden',
        HIDEN: 'hiden',
        SHOW_ALL: 'showAll',
        SHOW_GROUP: 'showGroup',
    },

    TASK_DETAIL_STATUS: {
        DEFAULT: 'hiden',
        ADD: 'add',
        EDIT: 'edit',
    },

    TASK_LIST: {
        DEFAULT: [], // todo
        // FORMAT: this.TASK.DEMO
    },

    TASK: {
        DEFAULT: {}, // todo
        FORMAT: {
            id: 1,
            nodeId: 1, // 节点标示, 因为数据库id会与mind标示冲突
            parentId: 1, // parentid = 1 表示 isroot
            title: '',
            content: '',
            /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */
            SMART: '',
            timestamp: 1590495644334,
            putoff: 1590495644334
        }
    }
}

export default CONST