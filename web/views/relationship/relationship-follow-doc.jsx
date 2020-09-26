target = [
    'follow up Interpersonal relationship for record'
]

page_config = {
    people_list: 'for list all people',
    people_list_add: 'for add list people',
    timeline: 'for follow up event and record',
    details: 'for view details'
}

people_list = () => {
    target = 'for list all people'

    page_Configuration = {
        list: 'all people that i need to follow up',
        time_sort: 'when cilck item then up top',
        search: 'for search people',
        add_btn: 'for add list people',
    }

    if (isSameJSX(people_list, timeline) === true) {
        isfor('localStorage')
    }
}

timeline = () => {
    target = 'for follow up event and record'

    page_Configuration = {
        interval: 'for step of distinguish this relationship',
        item_timeline_title: 'item title line to timeline for follow up',
        item_onclick: 'for view/eidt/jump details',
        timeline_line_onclick: 'for add details',
        null_add: 'for null add',
        null_del: 'for del list people',
    }
}

timeline = () => {
    target = 'for view/eidt/jump details'
}

DB_combine = () => {
    target = 'for record system to search'

    need = {
        newDataType: 'it is need new type, because it is new data structure',
        MultipleSelect_For_Tag: 'one of tag in record system',
        synchTo_recordSystem: 'for record data to view',
        eidtTojump_relationshipSystem: 'for eidt data and synchTo recordSystem'
    }
}
