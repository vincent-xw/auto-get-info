module.exports = function(app,express){
    app.use(express.static('./dashboard/web'));
    // 加载hbs模块
    var hbs = require('hbs');

    // 指定模板文件的后缀名为html
    app.set('view engine', 'html');

    // 运行hbs模块
    app.engine('html', hbs.__express);
}