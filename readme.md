# 个人网站第五版
第五版本整合3大系统
1. 日记系统 + 结论系统
2. 任务系统
3. 需求辅助分析系统


# 搭建步骤

- cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

- nestjs
```
cnpm i -g @nestjs/cli
cnpm install -g nodemon  
```

```
cd server
cnpm install -d
```

```
cd web
cnpm install -d
```

# 发布流程
端口号: src\main.ts:20 ——> 3815  
数据库: src\config\mysql.ts ——> 配置信息在有道云上  

之后操作: 参考有道云


# 额外源码 BUG
Ctrl + P -> node_modules\._express@4.17.1@express\lib\response.js:771  
删除 this.setHeader(field, value);

# localStorage

localStorage['website-station-system-token']  
localStorage['website-station-system-password']  

sessionStorage['WebSS-record-${JSON.stringify({ tag, type, minTimestamp, maxTimestamp })}']  
localStorage['website-station-system-record-tags']  
localStorage['website-station-system-record-statistics-time']
