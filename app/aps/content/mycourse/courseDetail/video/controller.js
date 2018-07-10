(function() {
    define(['jwplayer','videourl'], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var pk = params.pk;
                $scope.action=params.action;
                var treeid = params.treeid;
                var FK_SC_VIDEO = "";
                                
                /**
                * 上传课件
                */ 
                $scope.uploadRES = function(){
                	var m2 = {
      	                  url:"aps/content/myCourse/upload-uploadify/config.json?pk="+pk+"&UserID="+$scope.userInfo.GUID+"&FK_UNIT="+$scope.userInfo.FK_UNIT+"&treeid="+treeid+"&action=1",
      	                  contentName:"modal",
      	                  text:"上传课件",
      	                  icon:"upload",
      	                  size:"modal-lg"
      	                }
                	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                

                

                 /**
                 * 进入 切片 评课反思
                 */
                $scope.videoPointReview = function(obj){
                	var m2 = {
        	                  url:"aps/content/myCourse/courseDetail/videopoint/config.json?videopk="+obj+"&action="+$scope.action+"&pk="+pk+"&treeid="+treeid,
        	                  contentName:"content"
        	                }
                      eventBusService.publish(controllerName,'appPart.load.courseDetail.content', m2);
                }
                
                
                
                /**
                 * 删除视频
                 */
                $scope.deleteVideo = function(resid,videoid){
                	var resid = "'"+resid+"'";
                	$httpService.post(config.delResAttrURL, {
                		//RES_ATTR_TEA_PK:RES_ATTR_TEA_PK 20170915_ljh_修改
                		RES_ATTR_TEA_PK:resid
	               	}).success(function(data) {
	               		$httpService.post(config.delVideoURL, {
	               			SC_VIDEO_PK:videoid
		               	}).success(function(data) {
		               		$scope.find();
		                });
	               		
	   	            });
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
                
                
                var init = function(){
                	getUserInfo();
                }
                init();
                
                
                eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, m2) {
                	console.log(m2);
                	if(m2.scope=="courseDetail"){
                        if(m2.type=="videopoint"){//切片评课
                        	$scope.videoPointReview(FK_SC_VIDEO);
                    	}else if(m2.type=="video"){
                    		$scope.find();
                    	}
                	}
                	
                	
                });
                
                
                $scope.find = function(){
                	$scope.form.SC_COURSE_PK = pk;
            		$scope.form.FK_SC_COURSE = pk;
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findScVideoURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		 if($scope.action==1){
                   			   $('#'+controllerName+' .priviewVideo').show();
                             }else{
                           	   $('#'+controllerName+' .priviewVideo').hide();
                        	 }
                    		 $scope.videoList = data.data;
                    		 PAGE.buildPage($scope,data);
                    	}
                     }).error(function(data) {
                         console.log("获取切片评课异常");
                     });
                }
            	PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
