# 映射关系

原因: 为某些字段单独创建值, 浪费工作量; 所以使用到键值对key value的方式解决;

## API

- get:/map/get
[获取映射关系](http://localhost:1932/map/get?key=target)

- post:/map/set
[设置映射关系](http://localhost:1932/map/get?key=target&value=[{key:value}])

- clear:/map/clear
[清空映射关系](http://localhost:1932/map/clear?key=target)
