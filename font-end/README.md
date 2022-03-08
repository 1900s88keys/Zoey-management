# 前端框架 
    react 17.0.2
    typescript 4.5.5
    antd  4.18.8
    react-router-dom 6.2.1
    react-redux 7.2.6
    axios 0.26.0
    nandid 获取唯一key
    jwt-decode 解析token

# 文件结构
    ├── public 公共文件
    |  ├── favicon.ico
    |  └── index.html
    ├── src
    |   ├── api         ajax相关
    |   ├── static      静态资源
    |   |   └──images       静态图片
    |   ├── components  非路由组件
    |   ├── pages       路由组件
    ├── config      配置
    |   ├── redux       状态管理
    |   |   ├── actions       
    |   |   ├── reducer       
    |   |   └──reducer  
    ├── utils     工具     
    |   ├── App.tsx     应用根组件
    |   └── index.tsx   入口文件
    ├── craco.config.js antd按需引入的配置,可以用来修改antd的默认颜色
    ├── tsconfig.json
    ├── package.json
    └── README.md
