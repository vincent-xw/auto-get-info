const express = require('express')
const app = express()

app.get('/getInfo', function (req, res) {
	const request = require('request');
	var str = req.query.name;
	// http://map.baidu.com/?qt=s&wd="+str
	// "https://bj.lianjia.com/chengjiao/rs"+str+"/"
	var url = "http://api.map.baidu.com/place/v2/search?query="+str+"&region=北京&output=json&ak=m1YPA069wCs1pqMusm0ZYgVlnKChbWMz";
	request(url, function (error, response, body) {
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

app.get('*', function(req, res){
  res.json({'status':404});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
