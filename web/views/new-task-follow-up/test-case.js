const config = {
    group1_2_3: 'for add scene one/two/three',
    group4_5_6: 'for view scene one/two/three',
    group7_8: 'for modify scene one/two'
}

const group1 = () => {
    target = '突然想到自己要做什么?因为手头上有事情,所以临时记忆'
    case1 = {
        'open system': 'first step', // todo
        'select today mind': 'for target',
        'select item': 'for view',
        'operating': {
            'dele': 'ok',
            'add': 'ok',
            'accomplish': 'ok',
            'change': 'step5',
        },
        'onchange button': 'for change',
        'open this mind detail': {
            'is my target mind': 'for change',
            'is not my target mind': 'shwitch other mind',
        },
        'shwitch other mind': 'for change',
        'select ming': 'back step6',
    }
}
const group2 = () => {
    target = '想看看今天要做些什么?因为突然间闲下来了'
    case1 = {
        'open system': 'first step',
        'select all list': 'for target',
        'select sort': 'for top view',
        'operating': {
            'top': 'ok',
        },
    }
}
const group3 = () => {
    target = '今天要做什么?因为害怕忘记,临时记忆'
    case1 = {
        'open system': 'first step',
        'select all mind': 'for target',
        'select mind': 'for view',
        'operating': 'to 浏览-场景1 step5'
    }
}
const group4 = () => { // ok
    target = '想看看今天要做些什么?因为突然间闲下来了'
    case1 = {
        targrt: 'view today',
        allList: 'for open first',
        switchListMind: 'open',
        selectToday: 'open',
    }
}
const group5 = () => {
    target = '想看看刚刚在做什么?因为突然被打断了.'
    case1 = {
        targrt: 'view top',
        allList: 'for open first',
        selectToday: 'open',
    }
    case2 = {
        targrt: 'select top',
        item: 'for set top'
    }
}
const group6 = () => {
    target = '想看看以后有什么计划?因为想计划今天的任务'
    case1 = {
        targrt: 'view mind',
        allList: 'for open first',
        switchListMind: 'open',
        switchDetailMind: 'open',
        openTaskDetail: 'for view',
        closeTaskDetail: 'for view other',
        selectTodayMind: 'group4',
    }
    case2 = {
        targrt: 'switch Task To Target Mind',
        allList: 'for open first',
        switchListMind: 'for view',
        switchDetailMind: 'for view',
        selectTask: 'open task edit for select',
        switchButton: 'for slelect list mind',
        switchMindDetail: 'for slelect mind task',
        switchTaskToTargetMind: 'for slelect mind task',
    }
}
const group7 = () => {
    target = '想整理一下今天的任务, 因为刚刚完成了很多'
    case1 = {
        targrt: 'del today task',
        openTask: 'group4',
        delete: 'for del',
    }
    case2 = {
        targrt: 'add today task',
        openTask: 'group1',
    }
    case3 = {
        targrt: 'modify eidt today task',
        openTask: 'group4',
        eidtTask: 'for eidt',
    }
    case3 = {
        targrt: 'modify change today task',
        openTask: 'group4',
        changeTask: 'group6 case2',
    }
}
const group8 = () => {
    target = '想整理一下以后的任务, 因为今天完成了很多任务,而很多任务是临时规划的'
    case1 = {
        targrt: 'del mind task',
        openTask: 'group4',
        delete: 'for del',
    }
    case2 = {
        targrt: 'add mind task',
        openTask: 'group1',
    }
    case3 = {
        targrt: 'modify eidt mind task',
        openTask: 'group4',
        eidtTask: 'for eidt',
    }
    case3 = {
        targrt: 'modify change mind task',
        openTask: 'group4',
        changeTask: 'group6 case2',
    }
}