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
