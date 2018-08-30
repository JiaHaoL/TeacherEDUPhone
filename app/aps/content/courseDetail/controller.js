(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var pk = params.pk;
                var dataType=0;
                $scope.text = params.text;
                var FK_SC_VIDEO_POINT = "";
                var FK_SC_VIDEO="";
                
                
                
              //接收模块加载事件
            	eventBusService.subscribe(controllerName, 'appPart.load.courseDetail.content', function(event, m2) {
              	  if (m2.contentName === config.contentName) {
          			  return $scope.appPartSrc = m2.url;
      	          }
                });
                
                
                
                $scope.onlineTabclick = function(obj){
                	 var action = 0;
            		 if($scope.userInfo.GUID==$scope.dataVO.COURSESPEAKER || $scope.userInfo.GUID== $scope.dataVO.FK_TEACHER){
            			action=1;
                     }
            		 console.log("action="+action);
                	$('#'+controllerName+' .onlineTab').removeClass("active");
                	if(obj==0){//说课
                		    var m2 = {
               				  url:"aps/content/courseDetail/explain/config.json?pk="+params.pk,
            	                  contentName:"content",
            	                  hasButton:"right",
            	                  data:{MENU_PK:"none",MENU_NAME:"会议说明"}
            	                }
                      		eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}else if(obj==1){//学习课件
                		 var m2 = {
               				  url:"aps/content/courseDetail/courseware/config.json?pk="+params.pk+"&action="+action+"&treeid="+$scope.dataVO.FK_RES_SUBJECT_SORT,
            	                  contentName:"content",
            	                  hasButton:"right",
            	                  data:{MENU_PK:"none",MENU_NAME:"会议资料"}
            	                }
                        eventBusService.publish(controllerName,'appPart.load.content', m2);
                		
                	}else if(obj==2){//通知公告
                		 var m2 = {
                 				  url:"aps/content/courseDetail/notice/config.json?pk="+params.pk+"&action="+action,
              	                  contentName:"content",
              	                  hasButton:"right",
              	                  data:{MENU_PK:"none",MENU_NAME:"通知公告"}
              	                }
                          eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}else if(obj==3){//磨课
//                		$scope.appPartSrc = config.mokeURL+"?pk="+params.pk+"&action="+action+"&text="+$scope.text;
//                		$('#'+controllerName+' .tab_moke').addClass("active");
                	}else if(obj==4){//切片评课
                		 var m2 = {
               				  url:"aps/content/courseDetail/video/config.json?pk="+params.pk+"&action="+action+"&treeid="+$scope.dataVO.FK_RES_SUBJECT_SORT,
            	                  contentName:"content",
            	                  hasButton:"right",
            	                  data:{MENU_PK:"none",MENU_NAME:"切片评课"}
            	                }
                        eventBusService.publish(controllerName,'appPart.load.content', m2);
                	}else if(obj==5){//web视频课堂
//                		var m2 = {
//                    			  url:"aps/content/courseDetail/webVideo/config.json?pk="+pk,
//              	                  contentName:"modal",
//              	                  text:"WEB视频课堂",
//              	                  size:"modal-big"
//              	                }
//                        	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                		if(livestatus==1){
                			$scope.videoFullplay = function(obj){
                            	var m2 = {
                           			 url:"aps/content/courseDetail/videofullplay/config.json?videopk="+obj+"&action=0&pk="+pk+"&treeid="+treeid,
                     	                  contentName:"content",
                     	                  hasButton:"right",
                     	                  data:{MENU_PK:"none",MENU_NAME:"视频播放"}
                     	                }
                                 eventBusService.publish(controllerName,'appPart.load.content', m2);
                            }
                		}else if(livestatus==2){
                			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"直播已经结束！"});
                	   }else{
                		   eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"直播还未开始，请耐心等待！"});
                	   }
                		
                	}else if(obj==6){//投票问卷
                		//管理者
                		/*if($scope.dataVO.FK_TEACHER == $scope.userInfo.USER_PK){
                			var m2 = {
                     				  url:config.toupiaoURL+"?pk="+params.pk,
                  	                  contentName:"content",
                  	                  hasButton:"right",
                  	                  data:{MENU_PK:"none",MENU_NAME:"会议说明"}
                  	                }
                            		eventBusService.publish(controllerName,'appPart.load.content', m2);
                			//$scope.appPartSrc = config.toupiaoURL+"?pk="+params.pk;
                		}else{//参与者
*/                			var m2 = {
                   				  	  url:config.toupiaoUserURL+"?pk="+params.pk,
                	                  contentName:"content",
                	                  hasButton:"right",
                	                  data:{MENU_PK:"none",MENU_NAME:"投票问卷"}
                	                }
                          		eventBusService.publish(controllerName,'appPart.load.content', m2);
                			//$scope.appPartSrc = config.toupiaoUserURL+"?pk="+params.pk;
                		//}
                		
                		$('#'+controllerName+' .tab_toupiao').addClass("active");
                		//$scope.$apply();
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
                    	}
                     }).error(function(data) {
                         loggingService.info('获取当前用户出错');
                     });
                };
                
                
                var livestatus=0;
            	var init = function(){
            		$scope.form.SC_COURSE_PK = pk;
            		$httpService.post(config.findCourseApplyListURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		console.log(data);
                    	}else{
                    		$scope.dataVO = data.data[0];
                    		console.log($scope.dataVO);
                    		$scope.$apply();
                    		if($scope.dataVO.INCLUDE_OFFLINE==1 && $scope.dataVO.INCLUDE_ONLINE==0){
                    			$('#'+controllerName+' .tab_moke').hide();
                    			//$('#'+controllerName+' .tab_point').hide();
                    			$('#'+controllerName+' .tab_WEB').hide();
                    			getUserInfo();
                    			$('#'+controllerName+' .coursedetail_online').hide();
                    			$('#'+controllerName+' .coursedetail_offline').show();
                    		}else{
                    			if($scope.dataVO.INCLUDE_LIVE !=1){
                        			$('#'+controllerName+' .tab_WEB').hide();
                        			$('#'+controllerName+' .tab_moke').hide();
                        		}else{
                        			var str =$scope.dataVO.CLASS_START_TIME;
                        			str = str.replace(/-/g,"/");
                        			var datestart = new Date(str );
                        			var str1 =$scope.dataVO.CLASS_END_TIME;
                        			str1 = str1.replace(/-/g,"/");
                        			var dateend = new Date(str1);
                        			//当前
                        			var date1 = new Date();
                        			if(date1-dateend < 0){
                        				if(dateend-date1>0){
                        					if(date1-datestart>0){
                        						livestatus =1;
                        					}else{
                        						livestatus =3;
                        					}
                        					
                        				}
                        			}else{
                        				livestatus =2;
                        			}
                        		}

                    		}
                    		getUserInfo();
                    		
                    	}
	                 }).error(function(data) {
	                	 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"加载审核数据异常"});	//弹出提示框
	                 });
            	}
            	init();
                
                


            	
            }
        ];
    });
}).call(this);
