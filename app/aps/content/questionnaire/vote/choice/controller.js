(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = $routeParams.pk;
            	var isEnd = "";
            	
             	$httpService.post(config.findURL, {
             		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
             	}).success(function(data) {
        			if(data.data == null) {
       			     	$scope.find();
        			}else{
        				alert("您已经投过票!");
        				window.location.href="./voteResult/" + $scope.form.SURVEY_QUEST_ID;
        			}
	            });
             	
            	//查询数据
            	$scope.find = function() { 
            		//查询问卷名称
            		$httpService.post(config.findQuestionnaireByIdURL,{
            			"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
            		}).success(function(data) {
                		$scope.questionnaire = data.data;
                		isEnd = $scope.questionnaire.SURVEY_QUEST_STATE;
                		$scope.$apply();
    	            });
            		
            		//题目查询
            		$httpService.post(config.findTitleListByIdURL, $scope.form).success(function(data) {
                		$scope.titleList = data.data;
                		$scope.$apply();//强制刷新
    	            });	
            		
            		//查询题目选项
                	$httpService.post(config.findOptionListByIdURL,{
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.optionList = data.data;
                		$scope.$apply();
    	            });	
            	}   
            	
            	//ul间隔宽度
            	$scope.paddingWidth = ($('.index_top').width() - 174 * 5 - 15 * 2) / 10;
            	
       	 		//视频详情
       	 		$scope.videoDetails = function(obj) {
					window.location.href = "./videoDetails/"+obj.EXPAND_INFO_PK+"?qsPk="+$routeParams.pk;
				} 
       	 		
       	 		//投票
       	 		$scope.submitAnswer = function() {
		        	if(isEnd == '2') {
		        		alert("该评选已结束。");
     					return;
     				}

   	 				var values = [];
       	 			for (var i = 0; i < $scope.titleList.length; i++) {		
		       	 		if($scope.titleList[i].SURVEY_TYPE_ID == "6"){
		       	 			var ids = [];
		        			//获取投票id
		        			$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]:checked').each(function(){ 
		        				ids.push($(this).val());
		        				values.push($(this).val());
		                    });
		        			if(ids.length > $scope.titleList[i].MAXIMUN_VALUE || ids.length < $scope.titleList[i].MINIMUN_VALUE) {
		        				 alert("竞选项目:"+$scope.titleList[i].SURVEY_TITLE_TXT+"\n提示:投票数不能小于"+$scope.titleList[i].MINIMUN_VALUE+"且不能大于"+$scope.titleList[i].MAXIMUN_VALUE);
		        				 return;
		        			}
		        		}
		       	 		
		       	 		if($scope.titleList[i].SURVEY_TYPE_ID == "5") {
		       	 			var ids = [];
		        			$('#'+controllerName+' input[name="'+$scope.titleList[i].SURVEY_TITLE_ID+'VDR"]:checked').each(function(){ 
		        				values.push($(this).val());
		        				ids.push($(this).val());
		                    });
		        			if($scope.titleList[i].CHECKED == "true") {
		        				if(ids.length != 1) {
		        					alert("竞选项目:"+$scope.titleList[i].SURVEY_TITLE_TXT+"还没有投票");
		        					return;
		        				}
		        			}
		    			}
		       	 	}
	     
	       	 		if(confirm("投票之后不能修改!")) {
	       	 			$scope.form.FK_OPTION_LIST = JSON.stringify(values);
		       	 		$httpService.post(config.updateURL, $scope.form).success(function(data) {
		       	 			if(data.code == '0000') {
		       	 				alert("投票成功!");
		       	 				window.location.href="./success";
		       	 			}else{
		       	 				alert("投票失败!");
		       	 			}
		       	 		}).error(function(data) {
		       	 			alert("投票出错!");
		       	 		});
	       	 		}
       	 		}
       	 		
                //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            $(top.document.body).attr("style","background-color: white");
        		$("#index_footer").attr("style","display:none");
        		$("#one_td").attr("style","display:none");
//	            $scope.find();
            }
        ];
    });
}).call(this);
