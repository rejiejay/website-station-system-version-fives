// For UI Dev && Will Del
const fakeDataTaskList = [{
        id: 1,
        parentid: 'root',
        rootid: '12312',
        title: 'biapoti',
        content: 'neir onhg',
        SMART: '',
        /** S= specific 、M= measurable 、A= attainable 、R= relevant 、T= time-bound */
        timestamp: 1590495644334,
        putoff: 1590495644334,
    },
    { id: 2, parentid: 'root', rootid: '12312', title: '12312312321', content: 'ne123123123ir onhg', SMART: '', timestamp: 1590495644334, putoff: 1590495644334 },
    { id: 1123, parentid: 'root', rootid: 'fasfasf ', title: '123asdasd12312321', content: 'ne123123123ir onhg', SMART: '', timestamp: 1590495644334, putoff: 1590495644334 },
    { id: 3, parentid: 'root', rootid: '123adas', title: 'dasdasdasdasd', content: 'ne123123123ir onhg', SMART: '', timestamp: 1590495644334, putoff: 1590495644334 },
]

// For this, will Do it after UI done
const Server = {
    getAllTaskList: ({ pageNo }) => new Promise(resolve => {
        // Not handle Error. it must sucessful
        // const fetchInstance = await fetch.reGetConfirm('allTaskList', { pageNo: 1 })
        // return fetchInstance
        resolve(fakeDataTaskList) // Hard code, will do it later
    }),

    // for persistence, but now did`t do it, because it optimization and take lot time
    getAllTaskCount: () => new Promise(resolve => {
        // Not handle Error. it must sucessful
        // const fetchInstance = await fetch.reGetConfirm('allTaskList', { pageNo: 1 })
        // return fetchInstance
        resolve(4) // Hard code, will do it later
    }),

    addTask: async({ task, taskRootId }) => {},
    addNewRootMind: async({ task, taskRootId }) => {},
    getTaskMind: async({ groupTaskRootId }) => {},
    changeTaskNode: async({ task, taskParentId }) => {},
}

export default Server