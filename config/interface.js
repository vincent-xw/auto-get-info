module.exports = function(app){
    app.get('/getInfo', function (req, res) {
        const request = require('request');
        var str = req.query.name;
        var url = encodeURI("http://api.map.baidu.com/place/v2/search?query="+str+"&region=北京&output=json&ak=m1YPA069wCs1pqMusm0ZYgVlnKChbWMz");
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