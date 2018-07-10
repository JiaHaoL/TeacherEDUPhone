(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
            	
            	$httpService.post(config.getUserInfoURL, {}).success(function(data) {
        			$scope.userInfo = data.data;
        			$scope.$apply();
	            });
            	
                /**
                 * 我的会议
                 */
            	$scope.clickMenuMy = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/mycourse/config.json",
            				MENU_NAME:"我的会议"};
            		$scope.clickMenu(menu)
            	}
            	
            	/**
            	 * 我的通知
            	 */
            	$scope.clickMenuNotice = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/notice/config.json",
            				MENU_NAME:"听课评课通知"};
            		$scope.clickMenu(menu)
            	}
                
            	$scope.clickMenuSchool = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/schoolCourse/config.json",
            				MENU_NAME:"校所有会议"};
            		$scope.clickMenu(menu)
            	}
            	
            	$scope.clickMenuQRCode = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/signin/config.json",
            				MENU_NAME:"会议-二维码签到"};
            		$scope.clickMenu(menu)
            	}
            	
            	$scope.clickMenuSignin = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/signinVerify/config.json",
            				MENU_NAME:"会议-签到确认"};
            		$scope.clickMenu(menu)
            	}
            	
            	
            	
            	$scope.clickMenuArea = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/areaCourse/config.json",
            				MENU_NAME:"区所有会议"};
            		$scope.clickMenu(menu)
            	}
            	
            	
            	$scope.clickMenuteachEvaluate = function(){
            		var menu = {MENU_PK:"none",
            				MENU_LINK:"aps/content/teachEvaluate/config.json",
            				MENU_NAME:"课堂教学评价"};
            		$scope.clickMenu(menu)
            	}
            	
            	var currentMenu;	//当前菜单
            	$scope.clickMenu = function(menu) {
            		$scope.currentMenu = menu;
            		
            		//给当前菜单设置样式
                	$("#"+controllerName+" .menuPk-"+menu.MENU_PK).addClass("active");
                	if(currentMenu != null && currentMenu.MENU_PK != menu.MENU_PK){
                    	$("#"+controllerName+" .menuPk-"+currentMenu.MENU_PK).removeClass("active");
                	}
            		currentMenu = menu;
            		
            		var changeControllerData = {
          	                  url:menu.MENU_LINK,
          	                  contentName:"content",
          	                  hasButton:"right",
          	                  data:menu
          	                }
          	        return eventBusService.publish(controllerName,'appPart.load.content', changeControllerData);
	            };
            }
        ];
    });
}).call(this);
