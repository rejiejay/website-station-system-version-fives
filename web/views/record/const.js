const CONST = {

    DATA: {
        DEFAULT_LIST: [],
        DEFAULT_ITEM: null,
        DEMO: [{
            id: 1,
            tag: 'all',
            type: 0,
            title: 'title',
            content: '"{"situation":"情况是什么?","target":"当时目标想法是什么?","action":"有啥行动?","result":"结果如何?","clusion":"得出什么结论?"}"',
            timestamp: 1589973588328,
            images: ['myweb/task-assist/1583848484969.png', 'myweb/task-assist/1583848484969.png']
        }]
    },

    DATA_TYPE: {
        default: null,
        record: 0,
        diary: 1
    },

    DATA_FORMAT: {
        diary: {
            situation: '情况是什么?',
            target: '当时目标想法是什么?',
            action: '有啥行动?',
            result: '结果如何?',
            clusion: '得出什么结论?'
        }
    },

    SORT: {
        DEFAULT: 'time',
        TIME: 'time',
        RANDOM: 'random'
    },

    DEFAULT_PAGE_SIZE: {
        windows: 30,
        mobile: 10
    }
}

export default CONST