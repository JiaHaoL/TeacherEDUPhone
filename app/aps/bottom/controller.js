(function() {
    define([], function() {
        return [
            '$scope','$location','httpService','config', 'eventBusService','controllerName','loggingService', function($scope,$location,$httpService,config, eventBusService,controllerName,loggingService) {

            	var cBtn = 'welcome';
            	var btns = [];
            	btns[0] = 'weike';
            	btns[1] = 'wrongtitle';
            	btns[2] = 'welcome';
            	btns[3] = 'favorite';
            	btns[4] = 'my';
            	
            	/*
            	$("#app_main").on("swipeleft",function(){
            		for (var int = 0; int < btns.length; int++) {
						if(btns[int] == cBtn){
							if(int+1 == btns.length){
								$scope.open('news');
								break;
							}
							
							$scope.open(btns[int+1]);
							break;
						}
					}
            		
            	});
            	
            	$("#app_main").on("swiperight",function(){
            		
            		for (var int = 0; int < btns.length; int++) {
						if(btns[int] == cBtn){
							if(int-1 < 0){
								$scope.open('my');
								break;
							}
							
							$scope.open(btns[int-1]);
							break;
						}
					}
            	});
            	*/
            	
            	$scope.open = function(str){
            		cBtn = str;
            		//根据导航节点判断加载模块
            		var changeControllerData = {
          	                  url:'aps/content/'+str+'/config.json',
          	                  contentName:"content",
          	                  data:{}
          	                }
          	        return eventBusService.publish(controllerName,'appPart.load.content', changeControllerData);
            	}
	            
            }
        ];
    });
}).call(this);
