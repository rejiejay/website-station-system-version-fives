/**
 * url作用: 用于过滤路由, 例如 /todo/index.html
 */
const configs = [{
    route: '/index.html',
    entry: './views',
    output: './build'
}, {
    route: '/windows/index.html',
    entry: './views/windows',
    output: './build/windows'
}, {
    route: '/redirect/index.html',
    entry: './views/redirect',
    output: './build/redirect'
}]

export default configs