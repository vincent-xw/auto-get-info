var app = angular.module('app', []);
app.filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
);
app.controller("main",["$scope","$http",function($scope,$http){
    // 变量初始化
    $scope.isShowAmap = true;
    $scope.mapZone = true;
    $scope.switch = function(type,val){
        if(type == 'map'){
            if(val == 'amap'){
                $scope.isShowAmap = true;
            }else{
                $scope.isShowAmap = false;
            }
        }else if(type == 'panel'){
            if(val == 'mapPanel'){
                $scope.mapZone = true;
            }else{
                $scope.mapZone = false;
            }
        }
        $scope[val] = !$scope[val]
    }
    // 百度地图API功能
    var bmap = new BMap.Map("baidu");          
    bmap.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
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
   var amap = new AMap.Map('gaode',{
        resizeEnable: true,
        zoom: 13,
        center: [116.39,39.9]
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
    // 点击解析地址
    AMap.service('AMap.Geocoder',function(){
        var geocoder = new AMap.Geocoder({
            city: "010"//城市，默认：“全国”
        });
        var marker = new AMap.Marker({
            map:amap,
            bubble:true
        })
        $scope.loading = false;
        amap.on('click',function(e){
            $scope.$apply(function(){
                $scope.loading = true;
            });
            
            marker.setPosition(e.lnglat);
            geocoder.getAddress(e.lnglat,function(status,result){
                $scope.$apply(function(){
                    $scope.loading = false;
                    if(status=='complete'){
                        if(result.regeocode.addressComponent.neighborhoodType && result.regeocode.addressComponent.neighborhoodType.indexOf("小区") != -1){
                            $scope.mapDistrict = result.regeocode.addressComponent.neighborhood;
                            $scope.detailAddress = result.regeocode.formattedAddress;
                        }else{
                            $scope.mapDistrict = "没有获取到有效的小区信息";
                            $scope.detailAddress = "";
                        }
                    
                    }else{
                        $scope.mapDistrict = "获取失败请刷新重试";
                    }
                });
                
            })
        })
        
       

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
                arr = arr.unique('source');
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

    // 检索小区信息
    $scope.searchDistrict = function(str){
        var name = str || $scope.district;
        $scope.districtName = name;
        $http.get("/getDistrictSaleInfo?name="+name).then(
            
            function(resp){
    
                $scope.districtSaleInfo = resp.data.data;
    
            },
            function(resp){
                alert("加载失败，请重新请求，如果反复失败，联系我");
                console.log(resp);
    
            }
        );
        $http.get("/getDistrictInfo?name="+name).then(
            
            function(resp){
    
                $scope.districtInfo = resp.data.data;
    
            },
            function(resp){
                alert("加载失败，请重新请求，如果反复失败，联系我");                
                console.log(resp);
    
            }
        );
    }
    
}]);