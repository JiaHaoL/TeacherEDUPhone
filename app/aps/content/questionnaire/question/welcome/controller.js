(function() {
    define(['highchartsMore'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
                //查询数据	
            	$scope.form = {};
            	$scope.form.FK_COURSE = params.pk;
            	$scope.form.ROLE_CODE = "";
            	$('.school').hide();
            	
            	$httpService.post(config.findUserRoleCodeURL, {}).success(function(data) {
            		if(data.code == '0000') {
            			if(data.data == "0") {
            				$('.school').show();
            				$scope.form.ROLE_CODE = "0";
            			}else{
            				$scope.form.ROLE_CODE = "1";
            			}
            			PAGE.iniPage($scope);
            		}
            	});
            	
            	//学校
            	$httpService.post(config.findAllUnit, {}).success(function(data) {
        			$scope.units = data.data;
        			$scope.$apply();
	            });
            	
                //查询数据
            	$scope.find = function() {
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findURL, $scope.form).success(function(data) {
                		$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);	//处理分页
                        $scope.$apply();//强制刷新
    	            });		
            	}
            	
                //查询已经删除的问卷
            	$scope.remove = function() {
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.findRemovedListURL, $scope.form).success(function(data) {
                		$scope.dataList = data.data;
                        PAGE.buildPage($scope,data);	//处理分页
                        $('.caozuo > a').hide();
                        $('.see').show();
                        $('.analyse').hide();
    	            });	
            	}
            	
            	//查询为删除问卷
            	$scope.disRemove = function() {
            		$scope.select();
                    $('.caozuo > a').show();
                    $('.analyse').show();
            	}
	            
	            //查询按钮事件
	            $scope.select = function(){
	            	$scope.page.current = 1;
	            	$scope.find();
	            }
	            
	            //新增问卷
	            $scope.add = function() {
	            	var m2 = {
  	                  url:"aps/content/questionnaire/question/add/config.json?pk="+params.pk,
  	                  contentName:"modal",
  	                  text:"添加新问卷",
  	                  size:"modal-lg",
  	                  icon:"plus"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            };   
	            //编辑
	            $scope.update = function(obj) {
	            	if(obj.SURVEY_QUEST_STATE == '1'){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷正在收集中,不允许编辑!"});
	            	}else if(obj.SURVEY_QUEST_STATE == '2'){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷调查已结束。"});
	            	}else{
	            		var m2 = {
	          				  url:"aps/content/questionnaire/edit/update/update/config.json?pk="+obj.SURVEY_QUEST_ID,
	      	                  contentName:"content",
	      	                  text:"修改问卷信息",
	      	                  icon:"edit"
	          	        }
	                    eventBusService.publish(controllerName,'appPart.load.content', m2);
	            	}
                }
	            //问卷浏览
	            $scope.see = function(obj) {
	            	//普通问卷
	            	if(obj.SURVEY_QUEST_TYPE == '0') {
	            		window.open("./browse/"+obj.SURVEY_QUEST_ID,"_blank");
	            	}
	            	//评选问卷
	            	if(obj.SURVEY_QUEST_TYPE == '1'){
	            		window.open("./voteBrowse/"+obj.SURVEY_QUEST_ID,"_blank");
	            	}
            	}
	            
	            //答题用户列表
	            $scope.setAnswerUser = function(obj) { 
	            	if(obj.SURVEY_QUEST_TYPE == '0') {
	            		if(obj.ANONYMOUS == '1') {
	            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷为匿名问卷，不允许执行该操作。"});
	            		}else{
		            		var m2 = {
		        				  url:"aps/content/questionnaire/answerUser/list/config.json?pk="+obj.SURVEY_QUEST_ID+"&code="+$scope.form.ROLE_CODE+"&state="+obj.SURVEY_QUEST_STATE,
		    	                  contentName:"content",
		    	                  text:"答题用户列表",
		    	                  icon:"file"
		        	        }
		                  	eventBusService.publish(controllerName,'appPart.load.content', m2);
	            		}
	            	}else{
	            		if(obj.ANONYMOUS == '0') {
		            		var m2 = {
		        				  url:"aps/content/questionnaire/answerUser/list/config.json?pk="+obj.SURVEY_QUEST_ID+"&code="+$scope.form.ROLE_CODE+"&state="+obj.SURVEY_QUEST_STATE,
		    	                  contentName:"content",
		    	                  text:"答题用户列表",
		    	                  icon:"file"
		        	        }
		                  	eventBusService.publish(controllerName,'appPart.load.content', m2);
	            		}else{
		            		var m2 = {
		        				  url:"aps/content/questionnaire/answerUser/anonymous/config.json?pk="+obj.SURVEY_QUEST_ID+"&code="+$scope.form.ROLE_CODE,
		    	                  contentName:"content",
		    	                  text:"答题用户列表",
		    	                  icon:"file"
		        	        }
		                  	eventBusService.publish(controllerName,'appPart.load.content', m2);
	            		}
	            	}
            	}
	            
	            //问卷答案收集
	            $scope.answer = function(obj) {     
	            	if(obj.SURVEY_QUEST_STATE == '0') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷还没有发布，请先发布问卷。"});
	            	}else if(obj.NUM == null || obj.NUM == 0){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷暂时还没有答卷。"});
	            	}else{
			    		var m2 = {
							  url:"aps/content/questionnaire/viewAnswer/answerqueue/config.json?pk="+obj.SURVEY_QUEST_ID,
			                  contentName:"content",
			                  text:"问卷答题",
			                  icon:"edit"
				        }
			          	eventBusService.publish(controllerName,'appPart.load.content', m2);
	            	}
            	}
	            
	            //系统分析
	            $scope.analysis=function(obj){
	            	if(obj.SURVEY_QUEST_STATE == '0') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷还没有发布，请先发布问卷。"});
	            	}else if(obj.NUM == null || obj.NUM == 0){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷暂时还没有答卷。"});
	            	}else{
		            	 /*var m2= {
	            			  url:"aps/content/questionnaire/analysis/annlyqu/config.json?pk="+obj.SURVEY_QUEST_ID,
	            			  contentName:"content",
	            			  text:"系统分析",
	            			  icon:"edit"
		            	 }*/
		            	// eventBusService.publish(controllerName,'appPart.load.content',m2);
	            		
	            		var m2 = {
								  url:"aps/content/questionnaire/analysis/annlyqu/config.json?pk="+obj.SURVEY_QUEST_ID,
				                  contentName:"content",
				                  text:"问卷答题",
				                  icon:"edit"
					        }
				          	eventBusService.publish(controllerName,'appPart.load.content', m2);
	            	}
	            }
	            
	            //教师评测分析
	            $scope.evaluateAnalyse = function(obj) {
	            	if(obj.SURVEY_QUEST_STATE == '0') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷还没有发布，请先发布问卷。"});
	            	}else if(obj.NUM == null || obj.NUM == 0){
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷暂时还没有答卷。"});
	            	}else{
		            	 var m2= {
	            			  url:"aps/content/questionnaire/evaluateAnalyse/config.json?pk="+obj.SURVEY_QUEST_ID+"&code="+$scope.form.ROLE_CODE,
	            			  contentName:"content",
	            			  text:"评测分析",
	            			  icon:"edit"
		            	 }
		            	 eventBusService.publish(controllerName,'appPart.load.content',m2);
	            	}
	            }
	            
	            //结果导出
	            $scope.exportToExcel = function(obj) {
	            	$('#loading').css("display","block");
	            	$httpService.post(config.exportURL, obj).success(function(data) {
	            		if(data.code == '0000') {
	            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"导出成功!"});
	            		}else{
	            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"导出失败!"});
	            		}
	            		$('#loading').css("display","none");
	            	}).error(function(data) {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"导出出错!"});
	            		$('#loading').css("display","none");
	            	});
	            }
	            
	            //投票结果
	            $scope.result = function(obj) {
	            	window.open("./voteResult/"+obj.SURVEY_QUEST_ID,"_blank");
	            }
	            
	            //创建二维码
	    	    var createQRCode = function(id, url, width, height, src) {
	    	        $('#'+id).empty();
	    	        $('#'+id).qrcode({
	    	            render: 'canvas',
	    	            text: url,
	    	            width : width,              //二维码的宽度  
	    	            height : height,            //二维码的高度  
	    	            imgWidth : width/4,         
	    	            imgHeight : height/4,       
	    	            src: src            //图片中央的二维码
	    	        });
	    	    }
	    	    
	    	    //下载二维码
	    	    $scope.downloadQrcode = function() {
	    		    var canvas = $('#qrcode').find("canvas").get(0);
	    		    try {//解决IE转base64时缓存不足，canvas转blob下载
	    		        var blob = canvas.msToBlob();
	    		        navigator.msSaveBlob(blob, 'qrcode.png');
	    		    } catch (e) {//如果为其他浏览器，使用base64转码下载
	    		        var imgUrl = canvas.toDataURL("image/png");
	    		        $("#download").attr('href', imgUrl).get(0).click();
	    		    }
	    		    return false;
	    		};
	    		
	    		//问卷地址
	    		$scope.addressUrl = "";
        		$scope.mobileAddressUrl = "";
        		var questionnaireType, questionnairePk;
	    		$scope.addressUrlChange = function(str) {
	    			if(questionnaireType == '0') {
	    				$scope.addressUrl = "http://hygl.pdedu.sh.cn/write/"+questionnairePk;
            			$scope.mobileAddressUrl = "http://hygl.pdedu.sh.cn/AnonymousQuestionnaire/write/"+questionnairePk;
            			createQRCode("qrcode", $scope.addressUrl, 100, 100, "assets/img/logo.png");
	    			}else{
		    			if(str == 1) {
	        				$scope.addressUrl = "http://hygl.pdedu.sh.cn/voteChoice/"+questionnairePk;
	        				$('.mobileAddress').css("display","none");
	        				$('.webAddress').css("display","block");
	        				createQRCode("qrcode", $scope.addressUrl, 100, 100, "assets/img/logo.png");
	        			}else{
	        				$scope.mobileAddressUrl = "http://hygl.pdedu.sh.cn/mobileVoteSelect/"+questionnairePk;
	        				$('.webAddress').css("display","none");
	        				$('.mobileAddress').css("display","block");
	        				createQRCode("qrcode", $scope.mobileAddressUrl, 100, 100, "assets/img/logo.png");
	        			}
	    			}
	    		}
	    		 
	            // 问卷链接地址
	            $scope.anonymousQsLinkAddress = function(obj) {
	            	questionnaireType = obj.SURVEY_QUEST_TYPE;
	            	questionnairePk = obj.SURVEY_QUEST_ID;
	            	/*if(obj.ANONYMOUS == "1") {*/
	            		if(obj.SURVEY_QUEST_TYPE == '0') {
	            			$scope.addressUrl = "http://hygl.pdedu.sh.cn/write/"+obj.SURVEY_QUEST_ID;
	            		}else{
            				$scope.addressUrl = "http://hygl.pdedu.sh.cn/voteChoice/"+obj.SURVEY_QUEST_ID;
	            		}
	            		createQRCode("qrcode", $scope.addressUrl, 100, 100, "assets/img/logo.png");//生成二维码
	            		$('#issueModalAlert .issueModalLabelAlertTitle').html("问卷链接与二维码");
	            		/*$('#issueModalAlert').modal('show');*/
	            	/*}else{
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷为实名问卷。"});
	            	}*/
	            }
	            
	            //发布
	            $scope.issue = function(obj) {
	            	questionnaireType = obj.SURVEY_QUEST_TYPE;
	             	questionnairePk = obj.SURVEY_QUEST_ID;
	            	if(obj.TITLE_NUMS < 1) {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请先编辑问卷！"});
	            	}else if(obj.SURVEY_QUEST_STATE == '1') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷已发布，正在收集中..."});
	            	}else if(obj.SURVEY_QUEST_STATE == '2') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"已结束问卷不能重新发布！"});
	            	}else {
		            	if(obj.ANONYMOUS == "1") {
		            		if(obj.SURVEY_QUEST_TYPE == '0') {
		            			$scope.addressUrl = "http://hygl.pdedu.sh.cn/write/"+obj.SURVEY_QUEST_ID;
		            		}else{
		            			$scope.addressUrl = "http://hygl.pdedu.sh.cn/voteChoice/"+obj.SURVEY_QUEST_ID;
		            		}
		            		createQRCode("qrcode", $scope.addressUrl, 100, 100, "assets/img/logo.png");//生成二维码
		            		$httpService.post(config.updateStateURL, {
		            			"SURVEY_QUEST_ID" :obj.SURVEY_QUEST_ID
		            		}).success(function(data) {
		            			if(data.code == '0000') {
		            				eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
		    	            		$('#issueModalAlert .issueModalLabelAlertTitle').html("问卷链接与二维码");
		    	            		$('#issueModalAlert').modal('show');
		            			}else{
			            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布失败！"});
		            			}
		            		}).error(function(data) {
		            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布出错！"});
		            		});
		            	}else{
			            	if(obj.USER_NUMS < 1) {
			            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请先添加调查对象！"});
			            	}else{
				            	if(confirm("确定要发布此问卷!")) {
				            		if(obj.SURVEY_QUEST_TYPE == '1') {
					            		$httpService.post(config.sendVoteMessage, {
					            			"SURVEY_QUEST_ID":obj.SURVEY_QUEST_ID
					            		}).success(function(data) {
						            		if(data.code == '0000') {
						            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
				                    			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布成功！"});
						            		}else{
						            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布失败！"});
					            			}
					            		}).error(function(data) {
					            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布出错！"});
					            		});
				            		}
				            		if(obj.SURVEY_QUEST_TYPE == '0') {
					            		$httpService.post(config.sendWxMessage, {
					            			"SURVEY_QUEST_ID":obj.SURVEY_QUEST_ID
					            		}).success(function(data) {
						            		if(data.code == '0000') {
						            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
				                    			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布成功！"});
						            		}else{
						            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布失败！"});
					            			}
					            		}).error(function(data) {
					            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"发布出错！"});
					            		});
				            		}
				            	}
			            	}
		            	}
	            	}
	            }
	            
	            //结束问卷调查
	            $scope.over = function(obj) {
	            	if(obj.SURVEY_QUEST_STATE == '2') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"问卷发布已结束。"});
	            	}else {
		            	if(confirm("确定要结束问卷调查!")) {
			            	$httpService.post(config.updateQuestionnaireStateIsEndURL, {
			            		"SURVEY_QUEST_ID":obj.SURVEY_QUEST_ID
			            	}).success(function(data) {
			            		if(data.code == '0000') {
		                			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
		                			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"问卷调查结束！"});
			            		}
			            	});
		            	}
	            	}
	            }
	            
	            //复制问卷
	            $scope.copy = function(obj) {
	            	if(confirm("确定要复制该问卷!")) {
		            	$httpService.post(config.copyURL, obj).success(function(data) {
		            		if(data.code == '0000') {
		            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
		            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"复制成功!"});
		            		}else{
		            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"复制失败!"});
		            		}
		            	}).error(function(data) {
	    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"复制出错!"});
		            	});
	            	}
	            }
	            
	            //删除
	            $scope.deleteData = function(obj) {	  
	            	if(obj.SURVEY_QUEST_STATE != '0') {
	            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"该问卷不允许删除。"});
	            	}else {
		            	if(confirm("确定要删除该问卷!")) { 
			                $httpService.post(config.deleteURL, {"SURVEY_QUEST_ID":obj.SURVEY_QUEST_ID}).success(function(data) {            			
			                	if(data.code=="0000"){
		                			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
		                    		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功!"});
		            			}else{
		        	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除失败!"});
		            			}
		    	            }).error(function(data) {
		    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除出错!"});
		                    }); 	        
		            	}
	            	}
            	}
	            
                //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            }); 
	            
	            //关闭Alert
	            $scope.closeAlert = function() {
	            	$('#issueModalAlert').modal('hide');
	            }

            }
        ];
    });
}).call(this);
