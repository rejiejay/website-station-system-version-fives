/**
 * url作用: 用于过滤路由, 例如 /todo/index.html
 */
const configs = [{
    route: '/index.html',
    entry: './views',
    output: './build'
}, {
    route: '/record/index.html',
    entry: './views/record',
    output: './build/record'
}, {
    route: '/record/edit/index.html',
    entry: './views/record/edit',
    output: './build/record/edit'
}, , {
    route: '/record/time-selection/index.html',
    entry: './views/record/time-selection',
    output: './build/record/time-selection'
}, {
    route: '/require/index.html',
    entry: './views/require',
    output: './build/require'
}, {
    route: '/require/detail/index.html',
    entry: './views/require/detail',
    output: './build/require/detail'
}, {
    route: '/task/index.html',
    entry: './views/task',
    output: './build/task'
}, {
    route: '/task/start-up-assist/index.html',
    entry: './views/task/start-up-assist',
    output: './build/task/start-up-assist'
}, {
    route: '/task/edit/index.html',
    entry: './views/task/edit',
    output: './build/task/edit'
}, {
    route: '/new-task-follow-up/index.html',
    entry: './views/new-task-follow-up',
    output: './build/new-task-follow-up'
}]

export default configs