module.exports = function(app){
    app.get('/getDistrictInfo', function (req, res) {
        const request = require('request');
        var str = req.query.name;
        var url = encodeURI("https://bj.lianjia.com/xiaoqu/rs"+str+"/");
        request(url, function (error,response,body) {
            let result;
            if(!error && response && response.statusCode == 200){
                result = {
                    'status':true,
                    'data':JSON.parse(body)
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