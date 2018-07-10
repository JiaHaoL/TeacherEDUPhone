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
                		$('#'+controllerName+' .tab_speak').addClass("active");
                		$scope.appPartSrc = config.explainURL+"?pk="+params.pk;
                		$scope.$apply();

                	}else if(obj==1){//学习课件
                		 $scope.appPartSrc = config.coursewareURL+"?pk="+params.pk+"&action="+action+"&treeid="+$scope.dataVO.FK_RES_SUBJECT_SORT;
                		 $('#'+controllerName+' .tab_study').addClass("active");
                	}else if(obj==2){//通知公告
                		$scope.appPartSrc = config.noticeURL+"?pk="+params.pk+"&action="+action;
                		$('#'+controllerName+' .tab_notice').addClass("active");
                	}else if(obj==3){//磨课
                		$scope.appPartSrc = config.mokeURL+"?pk="+params.pk+"&action="+action+"&text="+$scope.text;
                		$('#'+controllerName+' .tab_moke').addClass("active");
                	}else if(obj==4){//切片评课
                		$scope.appPartSrc = config.videoURL+"?pk="+params.pk+"&action="+action+"&treeid="+$scope.dataVO.FK_RES_SUBJECT_SORT;
                		$('#'+controllerName+' .tab_point').addClass("active");
                	}else if(obj==5){//web视频课堂
//                		var m2 = {
//                    			  url:"aps/content/webVideo/config.json?pk="+pk,
//              	                  contentName:"modal",
//              	                  text:"WEB视频课堂",
//              	                  size:"modal-big"
//              	                }
//                        	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                		if(livestatus==1){
                			var m2 = {
                      			  url:"aps/content/webVideo/config.json?pk="+pk,
                	                  contentName:"modal",
                	                  text:"WEB视频课堂",
                	                  size:"modal-big"
                	                }
                          	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                		}else if(livestatus==2){
                			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"直播已经结束！"});
                	   }else{
                		  // eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"直播还未开始，请等待！"});
                		   
                		   var m2 = {
                       			  url:"aps/content/webVideo/config.json?pk="+pk,
                 	                  contentName:"modal",
                 	                  text:"WEB视频课堂",
                 	                  size:"modal-big"
                 	                }
                           	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	   }               		
                	}else{
                        alert("暂未实现");
                	}
                	
                }
                
                
                /**
                 * 返回
                */
                $scope.goBack = function(){
                	var menu = {
            				CONTROLLER_NAME: "TeacherEdu_schoolCheck_list", 
            				MENU_CODE: "00008802",
            				MENU_FATHER_PK: "48415b7c60cf48dab549f550c000e0b4",
            				MENU_IMG: "user",
        					MENU_LINK: "aps/content/myCourse/config.json",
    						MENU_NAME: "我的课程",
    						MENU_PK: "c68e1ece028a466486bb65374d5b1f3f",
    						MENU_STATUS: "0",
    						MENU_TYPE: "0"};       
                    var m2 = {
                 		    url:menu.MENU_LINK,
  	  	                    hasButton:"right",
  	  	                    data:menu,
        	                contentName:"content"
        	            }   
  	                eventBusService.publish(controllerName,'appPart.load.content', m2);
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
                    		$scope.onlineTabclick(0);
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
