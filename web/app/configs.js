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
}, {
    route: '/require/index.html',
    entry: './views/require',
    output: './build/require'
}, {
    route: '/task/index.html',
    entry: './views/task',
    output: './build/task'
}]

export default configs