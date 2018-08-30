(function() {
    define(['uploadauto','ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
	           //标题  
	           $scope.form={};	        	
	           $scope.form.SURVEY_QUEST_ID = params.pk;
	           $scope.form.SURVEY_TITLE_ID = params.id;    
	           
        	   $httpService.post(config.findCurrentTitleListByIdURL, {"SURVEY_TITLE_ID":$scope.form.SURVEY_TITLE_ID}).success(function(data) {
             		$scope.titleInfo = data.data;
     	    	    $scope.find();
        	   });
	           
	           //查询数据
	           $scope.find = function() { 	
	        	   $httpService.post(config.findRelTitleListByIdURL, {
	        		   "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID,
	        		   "SURVEY_TITLE_ORDER":$scope.titleInfo.SURVEY_TITLE_ORDER
	        	   }).success(function(data) {
	              		$scope.titleList = data.data;
	              		for (var i = 0; i < $scope.titleList.length; i++) {
	              			$scope.titleList[i].SURVEY_TITLE_TXT = $scope.titleList[i].SURVEY_TITLE_ORDER + ". " +
	              				$scope.titleList[i].SURVEY_TITLE_TXT + " ["+$scope.titleList[i].SURVEY_TYPE_NAME+"]";
						}
	              		$scope.$apply();	    
	               });
	           }
	         	
	           $scope.selectChange = function() {
	        	   if($scope.SURVEY_TITLE_ID == null) {
	        		   $('.optDiv').hide();
	        	   }else{		        	   
		               $httpService.post(config.findOptionListByPkURL, {"SURVEY_TITLE_ID":$scope.SURVEY_TITLE_ID}).success(function(data) {
		            		$scope.optionList = data.data;
		 	        	    $('.optDiv').show();
		        			$scope.$apply();
			           });
	               }	
	           }
	          
	           //接收确认按钮事件 	     
	           eventBusService.subscribe(controllerName, controllerName+'.confirm', function(event, btn) {
	        	   var title_rel = "";
	        	  
	        	   $('input[name="relOption"]:checked').each(function() {
	        		   title_rel += $(this).val()+",";
	        	   });
	        	   
	        	   title_rel = title_rel.substring(0,title_rel.length-1);
	        	   
	        	   if(title_rel == "") {
	        		   eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请选择关联题目及选项。"});	  
	        	   }else{
		        	   $httpService.post(config.updateURL, {
		        		   "SURVEY_TITLE_ID":$scope.form.SURVEY_TITLE_ID,
		        		   "SURVEY_TITLE_REL":title_rel
		        	   }).success(function(data) {
			    			if(data.code=="0000"){
			        			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
			        			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
			            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"关联成功!"});	                		
			    			}else{
			    				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"关联失败!"});
			    			}
		        	   }).error(function(data) {
			            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"关联出错!"});
		               }); 
	        	   }
	           });
          
	           //接收关闭按钮事件
	      	   eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
	               eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	      	   });
        
           }
       ];
    });
}).call(this);
