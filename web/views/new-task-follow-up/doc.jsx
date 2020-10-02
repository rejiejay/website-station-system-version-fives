tartget = [
    'for More Simpler to use'
]

requirement = {
    Data_persistence: 'for More Simpler to use',

    TargetMindList_List: 'for default list all',
    TargetMindList_List_sort_random: 'for select task to do',
    popOutTargetMindSelect: 'for user select target mind',
    TargetMindList_Mind: 'for target select',
    switchTargetMindList: 'for switch all list and mind target select',
    switchDetailMindList: 'for switch target mind list and mind detail select',
    TargetMindList_MindAdd: 'for add TargetMind',
    TaskDetail: 'for Add; edit; delete; complete;',
    TaskDetail_PutOff: '（Medium） for can`t do task record and make clear Task list',

    TaskDetail_Link: '（unimportant） for link task in mind',
    popOutTip: '（unimportant）for tip how to do',
    popOutStatistics: '（unimportant）for view Completed tasks',
}

TaskList_requirement = () => {
    config = {
        sortBtn: 'for switch view task way',
        addBtn: 'for add task',
        editBtn: 'for edit task',
        item: 'for view item'
    }
}

TaskDetailModal = () => {
    config = {
        aa: 'bb',
    }
}

add_scene = () => {
    scene_one = '突然想到自己要做什么?因为手头上有事情,所以临时记忆'
    scene_two = '将来要做什么?因为十分有意义,记忆下来,以后认真完成'
    scene_three = '今天要做什么?因为害怕忘记,临时记忆'
}

view_scene = () => {
    scene_one = '突然想到自己要做什么?因为手头上有事情,所以临时记忆'
    scene_two = '将来要做什么?因为十分有意义,记忆下来,以后认真完成'
    scene_three = '今天要做什么?因为害怕忘记,临时记忆'
}

modify_scene = () => {
    scene_one = '突然想到自己要做什么?因为手头上有事情,所以临时记忆'
    scene_two = '将来要做什么?因为十分有意义,记忆下来,以后认真完成'
    scene_three = '今天要做什么?因为害怕忘记,临时记忆'
}

'场景1' = () => {
    step = {
        '1': 'open system',
        'click-add': () => {
            inAllList = {
                add_today,
                'switch mind': 'for select group mind and add_to_group'
            }
            inGroupList = {
                add_to_group,
                'switch back all list': 'for add all today'
            }
            inAllMind = {
                add_today,
                'switch group mind': 'for add_to_group'
            }
            inGroupMind = {
                add_to_group,
                'switch back group list': 'for add_to_group',
                'switch back all mind': 'for add_to_group'
            }
        },
    }
}

'场景2' = () => {
    step = {
        'open system': 'first step',
        'select mind': {
            'if not target': () => {
                'add target' = 'todo'
                'refresh mind list'
            },
            'if have target': () => {
                strp3
            },
        },
        'add': 'for add',
        'add deep 2': {}
    }
}

'场景3' = () => {
    step = {
        'open system': 'first step',
        'select today mind': 'for target',
        'add': 'for add',
        'add deep 2': {}
    }
}

'浏览-场景1' = () => {
    step = {
        'open system': 'first step',
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

'浏览-场景2' = () => {
    step = {
        'open system': 'first step',
        'select all list': 'for target',
        'select sort': 'for top view',
        'operating': {
            'top': 'ok',
        },
    }
}

'浏览-场景3' = () => {
    step = {
        'open system': 'first step',
        'select all mind': 'for target',
        'select mind': 'for view',
        'operating': 'to 浏览-场景1 step5'
    }
}


'整理-场景1' = () => {
    'is same as 浏览-场景1'
}

'整理-场景2' = () => {
    step = {
        'open system': 'first step',
        'select all list': 'for target',
        'select sort': 'for top view',
        'operating': {
            'top': 'ok',
        },
    }
}
