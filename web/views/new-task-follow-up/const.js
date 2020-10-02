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

    TASK: {
        DEFAULT: {}, // todo
        DEMO: {}
    }
}

export default CONST