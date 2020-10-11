const displayFlex = {
    display: '-webkit-box',  /* 老版本语法 : Safari, iOS, Android browser, older WebKit browsers. */
    display: '-moz-box', /* 老版本语法 : Firefox (buggy) */
    display: '-ms-flexbox', /* 混合版本语法: IE 10 */
    display: '-webkit-flex', /* 新版本语法: Chrome 21+ */
    display: 'flex' /* 新版本语法: Opera 12.1, Firefox 22+ */
}

const start = {
    ...displayFlex,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
}

const startCenter = {
    ...displayFlex,
    justifyContent: 'flex-start',
    alignItems: 'center'
}

const startBottom = {
    ...displayFlex,
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
}

const columnCenter = {
    ...displayFlex,
    flexDirection: 'column',
    alignItems: 'center'
}

const center = {
    ...displayFlex,
    justifyContent: 'center',
    alignItems: 'center'
}

const rest = {
    WebkitBoxFlex: 1,
    MsFlex: 1,
    flex: 1
}

const basicFlex = {
    start, // 主轴水平向右 顶部对齐
    startTop: start, // 主轴水平向右 顶部对齐
    startCenter, // 主轴水平向右 居中
    startBottom, // 主轴水平向右 底部对齐
    columnCenter, // 主轴水平向下 居中对齐
    center, // 居中对齐
    rest // 占满剩余部分
}

export default basicFlex
