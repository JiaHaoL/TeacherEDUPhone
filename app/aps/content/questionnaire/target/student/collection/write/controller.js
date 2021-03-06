(function() {
    define(['highchartsMore'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	$scope.form.SURVEY_SUBJECTTEACHER_ID = "SUBJECTTEACHER4180A1127B7A681E0";
            	$scope.form.FK_USER = params.userPk;
            	
            	//查询数据
            	$scope.find = function() {
            		//查询问卷名称
                	$httpService.post(config.findQuestionnaireByIdURL,{
                		"SURVEY_QUEST_ID":params.pk
                	}).success(function(data) {
                		$scope.questionnaire = data.data;
                		$scope.$apply();
    	            });
                	
            		//查询题目
            		$httpService.post(config.findTitleListByIdURL, $scope.form).success(function(data) {
                		$scope.titleList = data.data;
                		//将____换成input标签
                        for (var i = 0; i < $scope.titleList.length; i++) {
                        	if($scope.titleList[i].SURVEY_TYPE_ID == 3){
                        		//  --  /_____{1,}/g
                        		$scope.titleList[i].SURVEY_TITLE_NAME = $scope.titleList[i].SURVEY_TITLE_NAME.replace(/_____/g, "<input  class='vacancy' name='"+$scope.titleList[i].SURVEY_TITLE_ID+"' />");
                            }
                		} 	

                        $scope.$apply();//强制刷新
    	            });	
            		
            		//行标题查询
              	    $httpService.post(config.findHeadingByQnIdURL, {
              		    "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
              	    }).success(function(data) {   
              		    $scope.headingList = data.data;
              		    $scope.$apply();
      	            });
            		
            		//查询选项
                	$httpService.post(config.findOptionListByIdURL,{
                		"SURVEY_QUEST_ID":params.pk
                	}).success(function(data) {
                		$scope.optionList = data.data;
                		$scope.$apply();
    	            });              	
             	}
            	
            	//提交答案
        	 	$scope.submitAnswer = function() { 
            		var resultVo = {};
            		resultVo.id=params.pk;
            		resultVo.answerUserId = params.userPk;
            		resultVo.teacherId=$scope.form.SURVEY_SUBJECTTEACHER_ID;
            		var titleResut = [];
            		var flag=true;         //判断必答题是否满足
	               
            		for (var i = 0; i < $scope.titleList.length; i++) {
						var values = [];	
						if($scope.titleList[i].SURVEY_TYPE_ID == "3") {
							var ids = [];
							//获取填空的选项id
							$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]').each(function(){ 
								ids.push($(this).val());
							});
							//获取填空的内容
							$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'"]').each(function(){ 
								values.push($(this).val());
							});
							//将填空id与内容拼接成一个新的字符串
							for (var j = 0; j < values.length; j++) {
								values[j] = ids[j]+","+values[j];	
							}	
						}else if($scope.titleList[i].SURVEY_TYPE_ID == "9"){  
							var ids = [];
							//1.获取主观题id
							$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]').each(function(){ 
								ids.push($(this).val());
							});
							//2.获取值
							$('#'+controllerName+' textarea[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'"]').each(function(){ 
								values.push($(this).val());
							});	
							for (var j = 0; j < values.length; j++) {
								values[j] = ids[j]+","+values[j];	
							}
	            		}else if($scope.titleList[i].SURVEY_TYPE_ID == "6"){
	            			var ids = [];
	            			//获取投票多选题id
	            			$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]:checked').each(function(){ 
	            				ids.push($(this).val());
	            				values.push(null);
	                        });
	            			if(ids.length <= $scope.titleList[i].MAXIMUN_VALUE && ids.length >= $scope.titleList[i].MINIMUN_VALUE) {
	            				for (var j = 0; j < values.length; j++) {
									values[j] = ids[j]+","+values[j];	
								}
	            			}else{
	            				 alert("题目"+(i+1)+"\n提示:选择项数不能小于"+$scope.titleList[i].MINIMUN_VALUE+"且不能大于"+$scope.titleList[i].MAXIMUN_VALUE);
	            				 return;
	            			}
	            		}else if($scope.titleList[i].SURVEY_TYPE_ID == "10" || $scope.titleList[i].SURVEY_TYPE_ID == "11") {
	            			var ids = [];
	            			$('#'+controllerName+' input[class="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]:checked').each(function(){ 
	            				ids.push($(this).val());
	            				values.push(null);
	                        });
	            			for (var j = 0; j < values.length; j++) {
	            				values[j] = ids[j]+","+values[j];	
							}
	            		}else{
	             			var ids = [];
	            			$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]:checked').each(function(){ 
	            				ids.push($(this).val());
	            				values.push(null);
	                        });
	            			for (var j = 0; j < values.length; j++) {
	            				values[j] = ids[j]+","+values[j];	
							}
            			}
            		
	                    var title = {};
	                    title.titleId = $scope.titleList[i].SURVEY_TITLE_ID;
	                    title.titleType = $scope.titleList[i].SURVEY_TYPE_ID;
	                    title.titlechecked=$scope.titleList[i].CHECKED;                   		
	                    title.resutId = values; 
	                	titleResut.push(title);

	                    //1.判断是必答题
	                	if($scope.titleList[i].CHECKED=="true"){
	                		//如果是必答题则提交的答案必须大于0   
	                		if($scope.titleList[i].SURVEY_TYPE_ID==3){
	                			$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'"]:text').each(function(){ 	
	                				if($(this).val()==""){
	                					flag=false;
	                				}    
	                            });     	         
	                		}else if($scope.titleList[i].SURVEY_TYPE_ID==9){
	                			$('#'+controllerName+' textarea[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'"]').each(function(){ 	
	                   				if($(this).val()==""){
	                   					flag=false;
	                   				}                    		
	                           	}); 
	                		}else{       
	                			if(values.length<=0){
		        					  flag=false;
		        					  break;
		        			    }		
	                		}
	                	}
	           	     }
	            	 resultVo.results =  titleResut; 

			         if(flag==true){  
			        	 if(confirm("提交之后不能修改,确定要提交!")) {
				              $httpService.post(config.addURL, {data:JSON.stringify(resultVo)}).success(function(data) {
				        		 if(data.code=="0000"){
				        			 eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});	//刷新范围的数据
				            		 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"提交成功"});	//弹出提示框
				            		 var m2 = {
				           			 	  url:"aps/content/questionnaire/student/target/config.json?pk="+params.pk+"&userPk="+params.userPk,
				       	                  contentName:"content",
				       	                  text:"返回问卷",
				       	                  icon:"edit"
				       	             }
				                 	 eventBusService.publish(controllerName,'appPart.load.content', m2);	
				    			 }else{
				    				 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"提交失败"});
				    			 }
				              }).error(function(data) {
				            	    eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"提交出错"});	//弹出提示框          		
				              });
			        	 }
			          }else{
			        	  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"[ * ] 必答题必须填写"});      	 
			          }           
			       };

			       //返回事件	
				   $scope.goBack=function(){          	            
		         		var m2 = {
							url:"aps/content/questionnaire/target/student/config.json?pk="+params.pk+"&userPk="+params.userPk,
							contentName:"content",
							text:"返回问卷",
							icon:"edit"
		     	        }
		               	eventBusService.publish(controllerName,'appPart.load.content', m2);	
				   }    
				   
				   $scope.find();
             }
         ];
    });
}).call(this);
