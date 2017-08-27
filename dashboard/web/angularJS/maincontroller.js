var app = angular.module('app', []);
app.controller("main",["$scope",function($scope){
    // 百度地图API功能
    var bmap = new BMap.Map("baidu");          
    bmap.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    var local = new BMap.LocalSearch(bmap, {
        renderOptions:{map: bmap},
        onSearchComplete: function(results){
			// 判断状态是否正确
			if (local.getStatus() == BMAP_STATUS_SUCCESS){
				$scope.listInfo(results,"baidu");
			}
		}
    });
    bmap.enableScrollWheelZoom(true);

   // 高德地图api
   var amap = new AMap.Map("gaode", {
        resizeEnable: true
    });
    var placeSearch;
    AMap.service(["AMap.PlaceSearch"], function() {
        placeSearch = new AMap.PlaceSearch({ //构造地点查询类
            pageSize: 5,
            pageIndex: 1,
            city: "010", //城市
            map: amap//,
            //panel: "panel"
        });
        
    });

    // 地图检索功能
    $scope.searchPoint = function(){
        $scope.index = 0;
        arr = [];
        // 高德搜索
        placeSearch.search($scope.key, function(status, result) {
            if(status == "complete"){
                $scope.listInfo(result,"gaode");
            }
        });
        // 百度搜索
        local.search($scope.key);
    }
    // 给出搜索结果建议
    $scope.show = false;
    var arr = [];
    $scope.listInfo = function(result,str){
        $scope.index++;
        
        if(str == "baidu"){
            console.log(result);
            for(var i = 0; i < result.vr.length; i++){
                if(result.vr[i].tags && result.vr[i].tags.length != 0){
                    for(var j = 0; j < result.vr[i].tags.length; j++){
                        if(result.vr[i].tags[j].indexOf("小区") != -1){
                            var temp = {
                                source:str,
                                name:result.vr[i].title.split("-")[0]
                            };
                            arr.push(temp);
                            break;
                        }
                    }
                }
                
            }
        }else{
            console.log(result);
            for(var i = 0; i < result.poiList.pois.length; i++){
                if(result.poiList.pois[i].type != undefined){
                    if(result.poiList.pois[i].type.indexOf("住宅小区") != -1){
                        var temp = {
                            source:str,
                            name:result.poiList.pois[i].name
                        };
                        arr.push(temp);
                    }
                }
            }
        }
        if($scope.index == 2){
            $scope.$apply(function(){
                $scope.show = true;
                $scope.suggest = arr;
                $scope.showSuggest = true;
                console.log(arr);
            });
            var timer = null;
            timer = setTimeout(function(){
                $scope.$apply(function(){
                    $scope.show = false;
                });
            },1000);
        }
    }
}]);