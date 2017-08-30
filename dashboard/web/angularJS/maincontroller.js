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
    bmap.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    var local = new BMap.LocalSearch(bmap, {
        renderOptions:{map: bmap},
        onSearchComplete: function(results){
		}
    });
    bmap.enableScrollWheelZoom(true);
    var geoc = new BMap.Geocoder();  
	bmap.addEventListener("click", function(e){        
        var pt = e.point;
        $scope.loading = true;
		geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            $scope.$apply(function(){
                $scope.loading = false;
                for(var i = 0; i < rs.surroundingPois.length; i++){
                    if(rs.surroundingPois[i].Si == "房地产"){
                        $scope.mapDistrict = rs.surroundingPois[i].title.split("小区")[0];
                        $scope.detailAddress = rs.surroundingPois[i].address;
                        return;
                    }
                }
                $scope.mapDistrict = "没有获取到有效的小区信息";
                $scope.detailAddress = "";
            });
		});        
	});
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
            
        });
        // 百度搜索
        local.search($scope.key);
    }

    // 检索小区信息
    $scope.searchPointBefore = function(str){
        
    }
    $scope.searchDistrict = function(str){
        $scope.switch("panel","districtPanel");
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