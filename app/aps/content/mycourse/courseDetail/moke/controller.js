(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var pk = params.pk;
                $scope.text = params.text;
                $scope.useraction = params.action;
                
                
                /**
                 * 进入板块话题
                 */
                $scope.mokeTopic = function(obj,text,moke){
                	var m2 = {
                			url:"aps/content/myCourse/moke/topic/config.json?FK_SC_FORUM_PLATE="+obj+"&plateText="+text+"&coursePK="+pk+"&courseText="+$scope.text+"&moke="+moke,
        	                 "contentName":"content"
        	            }   
  	                eventBusService.publish(controllerName,'appPart.load.content', m2);
                }
                /**
                 * 添加板块
                 */
                $scope.mokePlate= function(obj,action){
                	if(action==1){ //新增
                		var m2 = {
            	                  url:"aps/content/myCourse/moke/mokePlate/config.json?sc_forum_theme_pk="+obj,
            	                  contentName:"modal",
            	                  text:"添加主题",
            	                  icon:"bullhorn"
            	                }
                      	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}else if(action==2){//修改
                		var m2 = {
          	                  url:"aps/content/myCourse/moke/mokePlate/config.json?pk="+obj+"&type=1",
          	                  contentName:"modal",
          	                  text:"修改主题",
          	                  icon:"bullhorn"
          	                }
                    	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}else if(action==3){//删除
                    	$httpService.post(config.scForumPlateDeleteURL,{"SC_FORUM_PLATE_PK":obj}).success(function(data) {
                        	if(data.code != '0000'){
                        		loggingService.info(data.msg);
                        	}else{
                        		$scope.find();
                        		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功"});	//弹出提示框
                        	}
                         }).error(function(data) {
                             eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除失败"});	//弹出提示框
                         });

                		
                	}
                	
                }
                
                /**
                 * 磨课
                 */
                $scope.mokeTheme= function(obj,action){
                	if(action==1){
                		var m2 = {
            	                  url:"aps/content/myCourse/moke/mokeTheme/config.json?sc_course_pk="+pk,
            	                  contentName:"modal",
            	                  text:"添加磨课分区",
            	                  icon:"inbox"
            	                }
                      	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}else if(action==2){
                		var m2 = {
            	                  url:"aps/content/myCourse/moke/mokeTheme/config.json?pk="+obj+"&type=1",
            	                  contentName:"modal",
            	                  text:"修改分区",
            	                  icon:"inbox"
            	                }
                      	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}else if(action==3){
                		$httpService.post(config.scForumThemeDeleteURL,{"SC_FORUM_THEME_PK":obj}).success(function(data) {
                        	if(data.code != '0000'){
                        		loggingService.info(data.msg);
                        	}else{
                        		$scope.find();
                        		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功"});	//弹出提示框
                        	}
                         }).error(function(data) {
                             eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除失败"});	//弹出提示框
                         });            	
                	}
                }
                
                
                /**
            	 * 得到当前用户信息
            	 */
                var getUserInfo = function(){
                	$httpService.post(config.getUserInfoURL,{}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.userInfo = data.data;
                    		if($scope.useraction==1){
                    			$('#'+controllerName+' .div_theme_action').show();
                    			$scope.action = 1;
                    		}else{
                    			$('#'+controllerName+' .div_theme_action').hide();
                    			$scope.action = 0;
                    		}
                    	}
                     }).error(function(data) {
                         loggingService.info('获取当前用户出错');
                     });
                };
                
                
                eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, m2) {
                	console.log(m2);
                	if(m2.scope=="courseDetail"){
                         if(m2.type==3){//磨课
                    		$scope.find();
                    	}

                	}
                	
                	
                });
                
                


               $scope.find = function(){
             		$httpService.post(config.findScForumThemeURL,{
                		"FK_SC_COURSE":pk
                	}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		 $scope.mokeList = data.data;
                    		 console.log($scope.mokeList);
                    		 if($scope.mokeList.length>0){
                    			 $('#'+controllerName+' .moketheme_empty').hide();
                    			 $('#'+controllerName+' .div_bbs').show();
                    		 }else{
                    			 $('#'+controllerName+' .moketheme_empty').show();
                    			 $('#'+controllerName+' .div_bbs').hide();
                    		 }
                    		 $scope.$apply();
                    	}
                     }).error(function(data) {
                         loggingService.info('获取磨课主题异常');
                     });
                 }
               
               var init = function(){
               	getUserInfo();
               	$scope.find();
               }
               init()
            	
            }
        ];
    });
}).call(this);
