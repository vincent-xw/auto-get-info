# auto-get-info
    基于node express的一款房屋信息查询工具，用到的功能有:
        express 服务器软件
        request 发送请求
        cheerio 解析爬取得数据（个人非常喜欢它jQuery的书写风格，前端上手毫无压力）
        前端部分
        angular 1.6.4
        [bootstrap-paper](https://bootswatch.com/paper/) 一款基于bootstrap的material css框架
一款房屋信息查询辅助，主要功能：
- 整合百度与高德地图，根据输入的关键词信息查询并且展示查询结果
- 点击查询结果获取地图返回的小区数据
- 依据返回数据查询链家二手房交易信息并且爬取查询结果
- 依据返回数据查询小区信息，包括成交均价等
## 安装与运行
    git clone https://github.com/vincent-xw/auto-get-info.git
    npm install
    node app.js

程序默认运行3000端口
## Lience
MIT

