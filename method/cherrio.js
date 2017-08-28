module.exports = function(data,way){

    const cheerio = require("cheerio");

    var $ = cheerio.load(data);
    if(way == "sale" ){
        var str = "";
        $("ul.listContent li").each(function(){
            var today = new Date();
            var dealDay = new Date($(this).find(".dealDate").html());
            
            if(today - dealDay < 15552000000){
                
                str += "<li>"+$(this).html()+"</li>";
            }
        });
        return str;
    }else if(way == "district"){
        return $("ul.listContent").html();
    }else{
        var str = {
            'xiaoquAgent':$(".xiaoquAgent").html(),
            'brokerList':$(".brokerList ul").html()
        }
        return JSON.stringify(str);
    }
    
}