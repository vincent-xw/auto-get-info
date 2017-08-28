module.exports = function(app){
    // 获取小区成交记录
    app.get('/getDistrictSaleInfo', function (req, res) {
        const request = require('request');
        var str = req.query.name;
        var url = encodeURI("https://bj.lianjia.com/chengjiao/rs"+str+"/");
        request(url, function (error,response,body) {
            let result;
            if(!error && response && response.statusCode == 200){
                result = {
                    'status':true,
                    'data':require("./cherrio")(body,'sale')
                };
            }else{
                result = {
                    'status':false,
                    'msg':response.statusCode
                }
            }
        
        res.send(result);
        });


    });
    // 获取小区均价
    app.get('/getDistrictInfo', function (req, res) {
        const request = require('request');
        var str = req.query.name;
        var url = encodeURI("https://bj.lianjia.com/xiaoqu/rs"+str+"/");
        request(url, function (error,response,body) {
            let result;
            if(!error && response && response.statusCode == 200){
                result = {
                    'status':true,
                    'data':require("./cherrio")(body,'district')
                };
            }else{
                result = {
                    'status':false,
                    'msg':response.statusCode
                }
            }
        
        res.send(result);
        });
    });
    // 获取经纪人信息
    app.get('/getAgentInfo', function (req, res) {
        const request = require('request');
        var url = req.query.searchUrl;
        request(url, function (error,response,body) {
            let result;
            if(!error && response && response.statusCode == 200){
                result = {
                    'status':true,
                    'data':require("./cherrio")(body,'agent')
                };
            }else{
                result = {
                    'status':false,
                    'msg':response.statusCode
                }
            }
        
        res.send(result);
        });


    });
    app.get('/', function(req, res){
        res.sendfile("./dashboard/index.html");
    });

    app.get('*', function(req, res){
    res.json({'status':404});
    });
}