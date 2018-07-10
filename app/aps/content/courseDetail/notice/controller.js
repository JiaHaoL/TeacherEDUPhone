(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var pk = params.pk;
                var action = params.action;
         
                /**
                 * 发布公告
                */
                $scope.publicNotice = function(){
                	var m2 = {
        	                  url:"aps/content/myCourse/addNotice/config.json?sc_course_pk="+pk,
        	                  contentName:"modal",
        	                  text:"发布公告",
        	                  icon:"bullhorn",
        	                  size:"modal-lg"
        	                }
                  	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                
                /**
                 * 删除通知通告
                 */
                $scope.deleteNotice = function(){
                	var ids="";
                	$('#'+controllerName+' input[name="datalist_checkbox"]:checked').each(function(){
                         var id=$(this).val();
                           ids = ids+"'"+id+"',";
                     });
                 	ids = ids.substring(0,ids.length-1);
                 	var str = ids.split(",");
                	if(ids ==null || ids==""){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请先选择!"});	//弹出提示框
                		return;
                	}
                	$httpService.post(config.ScCourseNoticeDeleteURL,{"ids":ids}).success(function(data) {
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
                /**
                 * 修改公告
                */
                $scope.updateNotice = function(){
                	var ids="";
                	$('#'+controllerName+' input[name="datalist_checkbox"]:checked').each(function(){
                         var id=$(this).val();
                           ids = ids+id+",";
                     });
                 	ids = ids.substring(0,ids.length-1);
                 	var str = ids.split(",");
                	if(str.length>1){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"只能选择一个进行修改!"});	//弹出提示框
                		return;
                	}
                	if(ids ==null || ids==""){
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请先选择!"});	//弹出提示框
                		return;
                	}
                	var m2 = {
        	                  url:"aps/content/myCourse/addNotice/config.json?pk="+ids+"&type=1",
        	                  contentName:"modal",
        	                  text:"修改公告",
        	                  icon:"bullhorn",
        	                  size:"modal-lg"
        	                }
                  	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                
                


                eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, m2) {
                	console.log(m2);
                	if(m2.scope=="courseDetail"){
                		if(m2.type==2){//通知公告
                    		$scope.find();
                    	}
                	}
                	
                	
                });
            	

                $scope.find = function(){
                	$scope.form.SC_COURSE_PK = pk;
            		$scope.form.FK_SC_COURSE = pk;
                	$scope.form.page = JSON.stringify($scope.page);
                	$httpService.post(config.findScCourseNoticeURL,$scope.form).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		
                    		 if(action==1){
                   			     $('#'+controllerName+' .select_notice').show();
                             }else{
                           	    $('#'+controllerName+' .select_notice').hide();
                        	 }
                    		 $scope.noticeList = data.data;
                    		 PAGE.buildPage($scope,data);
                    	}
                     }).error(function(data) {
                         loggingService.info('获取通告异常');
                     });
                }
                
                PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
