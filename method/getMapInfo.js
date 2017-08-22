
exports.getMapInfo = function(str){
	const request = require('request');
	let url = "http://map.baidu.com/?qt=s&wd="+str;
	
	request("https://bj.lianjia.com/chengjiao/rs"+str+"/", function (error, response, body) {
	  return body;
	});
}