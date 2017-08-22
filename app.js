const express = require('express')
const app = express()

app.get('/getInfo', function (req, res) {
	const request = require('request');
	var str = req.query.name;
	request("https://bj.lianjia.com/chengjiao/rs"+str+"/", function (error, response, body) {
	  let result = {
			'status':true,
			'data':body
		};
	  res.send(result);
	});
	
	
});

app.get('*', function(req, res){
  res.json({'status':404});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})