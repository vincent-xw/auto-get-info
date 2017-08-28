const express = require('express');
const app = express();
// 加载hbs配置
var hbs_config = require("./config/hbs_config");

hbs_config(app,express);

// 加载接口配置
let interface_config = require("./method/interface");

interface_config(app);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
