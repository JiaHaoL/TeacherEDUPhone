(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化
            	$scope.form = {};
            	$scope.form.SURVEY_QUEST_ID = params.pk;
            	var qsType = "";

            	//查询数据          	
            	$scope.find = function() {
                	  //问卷名称查询
                	  $httpService.post(config.findQuestionnaireByIdURL,{
                		  "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	  }).success(function(data) {
                		    $scope.questionnaire = data.data;
                		    qsType = data.data.SURVEY_QUEST_TYPE;
                  			$scope.$apply();
    	              });
            		  
                	  //题目查询
                	  $httpService.post(config.findTitleListByIdURL, $scope.form).success(function(data) {   
                		   $scope.titleList = data.data;
                		   $scope.$apply();
        	          });	
                	  
                	  //行标题查询
                	  $httpService.post(config.findHeadingByQnIdURL, {
                		  "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	  }).success(function(data) {   
                		   $scope.headingList = data.data;
                		   $scope.$apply();
        	          });
                	   
                	  //题目选项查询
                	  $httpService.post(config.findOptionListByIdURL,{
                		  "SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	  }).success(function(data) {;
                    		$scope.contentList = data.data;
                    		$scope.$apply();
        	          });
                }
            	
            	//关联逻辑
            	$scope.rel = function(obj) {
            		if(obj.SURVEY_TITLE_ORDER == '1') {
            			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"第1题不能设置关联逻。"});
            		}else{
     	        	   $httpService.post(config.findRelTitleListByIdURL, {
    	        		   "SURVEY_QUEST_ID":obj.SURVEY_QUEST_ID,
    	        		   "SURVEY_TITLE_ORDER":obj.SURVEY_TITLE_ORDER
    	        	   }).success(function(data) {
    	        		    console.log(data);
    	        		    if(data.data.length <= 0) {
    	        		    	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"提示：此题前面没有单选题跟多选题，无法设置关联逻辑。"});
    	        		    }else{
    		            		var m2 = {
			            			url:"aps/content/questionnaire/edit/rel/config.json?id="+obj.SURVEY_TITLE_ID+"&pk="+params.pk,
			            			contentName:"modal",
			            			text:"关联逻辑",
			                  		icon:"edit"
			            		}
			            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
    	        		    }
    	               });
            		}
				}
            	
                //上移
                $scope.updata=function(obj){
            	   if(obj>0) { 	
            		   var temp1=$scope.titleList[obj-1];
            		   $scope.titleList[obj-1]=$scope.titleList[obj];
            		   $scope.titleList[obj]=temp1; 
            		   
            		   var temp2=$scope.titleList[obj-1].SURVEY_TITLE_ORDER;
            		   $scope.titleList[obj-1].SURVEY_TITLE_ORDER=$scope.titleList[obj].SURVEY_TITLE_ORDER;
            		   $scope.titleList[obj].SURVEY_TITLE_ORDER=temp2;   			 
	               }
               }
               
               //下移
               $scope.down=function(obj){
            	   if(obj<$scope.titleList.length-1) {   
            		   var temp1=$scope.titleList[obj+1];
            		   $scope.titleList[obj+1]=$scope.titleList[obj];
            		   $scope.titleList[obj]=temp1; 
            		   
            		   var temp2=$scope.titleList[obj+1].SURVEY_TITLE_ORDER;
            		   $scope.titleList[obj+1].SURVEY_TITLE_ORDER=$scope.titleList[obj].SURVEY_TITLE_ORDER;
            		   $scope.titleList[obj].SURVEY_TITLE_ORDER=temp2;  
	               }              	  
               }
               
               //最前
               $scope.frist=function(obj){
            	   if(obj>0) {
                	   var temp1,temp2;
                	   for (var i = obj; i > 0; i--) {
            			   temp1 = $scope.titleList[i-1];
            			   $scope.titleList[i-1] = $scope.titleList[i];
            			   $scope.titleList[i] = temp1;
            			   
            			   temp2=$scope.titleList[i-1].SURVEY_TITLE_ORDER;
                		   $scope.titleList[i-1].SURVEY_TITLE_ORDER=$scope.titleList[i].SURVEY_TITLE_ORDER;
                		   $scope.titleList[i].SURVEY_TITLE_ORDER=temp2;  
                	   }
            	   }
               }
               
               //最后
               $scope.last=function(obj){
            	   if(obj<$scope.titleList.length-1) { 	            	
            		   var temp1,temp2;
                	   for (var i = obj; i < $scope.titleList.length-1; i++) {
            			   temp1 = $scope.titleList[i+1];
            			   $scope.titleList[i+1] = $scope.titleList[i];
            			   $scope.titleList[i] = temp1;
            			   
            			   temp2=$scope.titleList[i+1].SURVEY_TITLE_ORDER;
                		   $scope.titleList[i+1].SURVEY_TITLE_ORDER=$scope.titleList[i].SURVEY_TITLE_ORDER;
                		   $scope.titleList[i].SURVEY_TITLE_ORDER=temp2;  
                	   } 
	               }    
               }
               
               //完成编辑
               $scope.updateTitle=function() {
            	   var updatetitle={};
            	   updatetitle.id=params.pk;            	  
            	   var titles=[];
            	   for(var i=0; i<$scope.titleList.length; i++){
            		     var title={};
            		     title.titleId=$scope.titleList[i].SURVEY_TITLE_ID;            		    
            		     titles.push(title);//获取标题id   
            		     
            		     var counts=[];
            		     for(var j=0; j<$scope.contentList.length; j++){
	                  		   var count={};
	                  		   var obj = $scope.contentList[j];
	                  		   if(obj.SURVEY_TITLE_ID== title.titleId){
	                  			  count.contentid=$scope.contentList[j].SURVEY_CONTENT_ID;//获取选项id
		                  		  counts.push(count);
	                  		   }		   
	                  	 }		           		     
            		     title.countresult=counts;
            	   }
            	   updatetitle.titleid=titles;

            	   if( updatetitle.titleid == null ||  updatetitle.titleid.length < 1){
            		   eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"您还没添加题目。"});
            	   }else{
                	   $httpService.post(config.updateTitleURL, {data:JSON.stringify(updatetitle)}).success(function(data) {            			
      		            	if(data.code=="0000"){
      		             		var m2 = {
    		         				  url:"aps/content/questionnaire/question/welcome/config.json?pk="+params.pk,
    		     	                  contentName:"content",
    		     	                  text:"返回问卷",
    		     	                  icon:"edit"
        		         	    }
      		            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存成功"});
      		                   	eventBusService.publish(controllerName,'appPart.load.content', m2);
      		    			}else{
      		    				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存失败"});
      		    			}
      				   }).error(function(obj) {
      						eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"保存出错"});
      				   });
            	   }
               }
               
               //浏览问卷
               $scope.scann=function(){
            	   window.open("./browse/"+params.pk,"_blank");
               }
                	
                //删除题目及选项		       
		        $scope.removeTitle=function(obj){	        	
		            $httpService.post(config.deleteTitleURL, {
		            	"SURVEY_TITLE_ID":obj.SURVEY_TITLE_ID,
		            	"SURVEY_TYPE_ID":obj.SURVEY_TYPE_ID
		            }).success(function(data) {            			
		            	if(data.code=="0000"){
		        			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
		            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功"});
		    			}
					}).error(function(obj) {
						eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除出错"});
					}); 
		        }
		        
		        //竞选人员
		        $scope.expandInfo = function(obj) {
             		var m2 = {
           				  url:"aps/content/questionnaire/edit/selection/expandInfo/config.json?pk="+obj.SURVEY_TITLE_ID+"&titleName="+obj.SURVEY_TITLE_TXT,
       	                  contentName:"modal",
       	                  size:"modal-lg",
       	                  text:"竞选人员",
       	                  icon:"edit"
   	                }
                    eventBusService.publish(controllerName,'appPart.load.modal', m2);	
		        }
		        
	            //1和2新增单选题和多选题	
            	$scope.addChoice=function(obj){  
             		var m2 = {
         				  url:"aps/content/questionnaire/edit/insert/TitleInsert/config.json?pk="+params.pk+"&id="+obj,
     	                  contentName:"modal",
     	                  text:"添加选择题",
     	                  icon:"edit"
 	                }
                   	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
            	}
            		
                //3.新增填空	
            	$scope.addVacancy=function(obj){   
             		var m2 = {
         				  url:"aps/content/questionnaire/edit/insert/TitleInsertTwo/config.json?pk="+params.pk+"&id="+obj,
     	                  contentName:"modal",
     	                  text:"添加填空题",
     	                  icon:"edit"
     	            }
                   	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
            	}
            	
            	//4.添加判断
             	$scope.addJudge=function(obj){   
             		var m2 = {
         				  url:"aps/content/questionnaire/edit/insert/TitleInsertJudg/config.json?pk="+params.pk+"&id="+obj,
     	                  contentName:"modal",
     	                  text:"添加判断题",
     	                  icon:"edit"
     	            }
                   	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
             	}
             	
             	//5.添加投票单选
             	$scope.addVoteSignal = function(obj){
             		if(qsType == '0') {
                 		var m2 = {
               				  url:"aps/content/questionnaire/edit/insert/TitleInsertVoteS/config.json?pk="+params.pk+"&id="+obj,
           	                  contentName:"modal",
           	                  text:"添加投票单选题",
           	                  icon:"edit"
           	            }
             		}
             		if(qsType == '1') {
                 		var m2 = {
               				  url:"aps/content/questionnaire/edit/selection/insertVote/config.json?pk="+params.pk+"&id="+obj,
           	                  contentName:"modal",
           	                  text:"投票单选",
           	                  icon:"edit"
           	            }
             		}
                	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
             	}
             	
                //6.添加投票多选
             	$scope.addVoteMultiple = function(obj) { 
             		if(qsType == '0') {
	             		var m2 = {
	         				  url:"aps/content/questionnaire/edit/insert/TitleInsertVote/config.json?pk="+params.pk+"&id="+obj,
	     	                  contentName:"modal",
	     	                  text:"添加投票多选题",
	     	                  icon:"edit"
	     	            }
             		}
             		if(qsType == '1') {
                 		var m2 = {
               				  url:"aps/content/questionnaire/edit/selection/insertVote/config.json?pk="+params.pk+"&id="+obj,
           	                  contentName:"modal",
           	                  text:"投票多选",
           	                  icon:"edit"
           	            }
             		}
                   	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
             	}
             	
                //7.添加评分单选
             	$scope.addScoreSignal = function(obj){   
             		var m2 = {
         				  url:"aps/content/questionnaire/edit/insert/TitleInsertScoreS/config.json?pk="+params.pk+"&id="+obj,
     	                  contentName:"modal",
     	                  text:"添加评分单选题",
     	                  icon:"edit"
     	            }
                   	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
             	}
             	
                //8.添加评分多选
             	$scope.addScoreMultiple = function(obj){   
             		var m2 = {
         				  url:"aps/content/questionnaire/edit/insert/TitleInsertScore/config.json?pk="+params.pk+"&id="+obj,
     	                  contentName:"modal",
     	                  text:"添加评分多选题",
     	                  icon:"edit"
     	            }
                   	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
             	}
             	
	            //9.添加主观题
	            $scope.addSubjective=function(obj){   
	             	var m2 = {
     				    url:"aps/content/questionnaire/edit/insert/TitleInsertSubjective/config.json?pk="+params.pk+"&id="+obj,
 	                    contentName:"modal",
 	                    text:"添加主观题",
 	                    icon:"edit"
     	            }
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);	
	        	}
	            
	            //10.添加矩阵单选题
	            $scope.addMatrixSignal = function(obj){   
	             	var m2 = {
     				    url:"aps/content/questionnaire/edit/insert/matrixSignalChoice/config.json?pk="+params.pk+"&id="+obj,
 	                    contentName:"modal",
 	                    text:"添加矩阵单选题",
 	                    icon:"edit"
     	            }
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);	
	        	}
	            
	            //11.添加矩阵多选题
	            $scope.addMatrixMultiple = function(obj){   
	             	var m2 = {
     				    url:"aps/content/questionnaire/edit/insert/matrixMultipleChoice/config.json?pk="+params.pk+"&id="+obj,
 	                    contentName:"modal",
 	                    text:"添加矩阵多选题",
 	                    icon:"edit"
     	            }
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);	
	        	}
	              
              	//修改问卷名称
              	$scope.updateQnInfo=function(obj) {   
              		if($scope.questionnaire.ANSWER_USER_NUM > 1){
              			eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请先删除问卷用户，才允许修改!"});
              			return;
              		}
              		var m2 = {
       				    url:"aps/content/questionnaire/edit/update/updateQuestion/config.json?pk="+params.pk,
   	                    contentName:"modal",
   	                    text:"修改问卷",
   	                    size:"modal-lg",
   	                    icon:"edit"
       	            }
                 	eventBusService.publish(controllerName,'appPart.load.modal', m2);	
		     	}
              	
		     	//修改选择题，判断题，投票题
		     	$scope.updateChoice = function(obj) {   
		     		if(obj.SURVEY_TYPE_ID == '5' || obj.SURVEY_TYPE_ID == '6') {
		     			if(qsType == '0') {
			            	var m2 = {
		  	                    url:"aps/content/questionnaire/edit/update/updateQue/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
		  	                    contentName:"modal",
		  	                    text:"修改选择题",
		  	                    icon:"edit"
		  	                }
		     			}
	             		if(qsType == '1') {
	                 		var m2 = {
	                 			url:"aps/content/questionnaire/edit/selection/updateVote/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
           	                    contentName:"modal",
           	                    text:"修改选择题",
           	                    icon:"edit"
	           	            }
	             		}
		     		}else{
		            	var m2 = {
	  	                    url:"aps/content/questionnaire/edit/update/updateQue/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
	  	                    contentName:"modal",
	  	                    text:"修改选择题",
	  	                    icon:"edit"
	  	                }
		     		}
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);	          
            	}
            
            	//修改填空题
            	$scope.updateVacancy = function(obj) {                     
	            	var m2 = {
  	                    url:"aps/content/questionnaire/edit/update/updateTwo/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
  	                    contentName:"modal",
  	                    text:"修改填空题",
  	                    icon:"edit"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);	          
            	}
            
              	//修改评分题
                $scope.updateScore = function(obj) {                     
	            	var m2 = {
  	                    url:"aps/content/questionnaire/edit/update/updatescore/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
  	                    contentName:"modal",
  	                    text:"修改评分题",
  	                    icon:"edit"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);	          
            	}
              
            	//修改主观题
               	$scope.updateSubjective = function(obj) {                     
	            	var m2 = {
  	                  url:"aps/content/questionnaire/edit/update/updateSubjective/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
  	                  contentName:"modal",
  	                  text:"修改主观题",
  	                  icon:"edit"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);	          
               	}
               	
               	//修改矩阵题
	            $scope.updateMatrix = function(obj){   
	             	var m2 = {
         				  url:"aps/content/questionnaire/edit/update/matrix/config.json?pk="+obj.SURVEY_TITLE_ID+"&typeid="+obj.SURVEY_TYPE_ID,
     	                  contentName:"modal",
     	                  text:"修改矩阵题",
     	                  icon:"edit"
     	            }
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);	
	        	}
	            
	            //复制选择题，判断题，投票题
	            $scope.copyChoice = function(obj) {
		     		if(obj.SURVEY_TYPE_ID == '5' || obj.SURVEY_TYPE_ID == '6') {
		     			if(qsType == '0') {
			            	var m2 = {
		  	                    url:"aps/content/questionnaire/edit/copy/choice/config.json?pk="+obj.SURVEY_TITLE_ID,
		  	                    contentName:"modal",
		  	                    text:"复制选择题",
		  	                    icon:"edit"
		  	                }
		     			}
	             		if(qsType == '1') {
	                 		var m2 = {
	                 			url:"aps/content/questionnaire/edit/selection/copyVote/config.json?pk="+obj.SURVEY_TITLE_ID,
           	                    contentName:"modal",
           	                    text:"复制选择题",
           	                    icon:"edit"
	           	            }
	             		}
		     		}else{
		            	var m2 = {
		            		url:"aps/content/questionnaire/edit/copy/choice/config.json?pk="+obj.SURVEY_TITLE_ID,
	  	                    contentName:"modal",
	  	                    text:"复制选择题",
	  	                    icon:"file"
	  	                }
		     		}
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);	
	            }
	            
	            //复制填空题
	            $scope.copyVacancy = function(obj) {
	            	var m2 = {
  	                    url:"aps/content/questionnaire/edit/copy/vacancy/config.json?pk="+obj.SURVEY_TITLE_ID,
  	                    contentName:"modal",
  	                    text:"复制填空题",
  	                    icon:"file"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            }
	            
	            //复制评分题
	            $scope.copyScore = function(obj) {
	            	var m2 = {
  	                    url:"aps/content/questionnaire/edit/copy/score/config.json?pk="+obj.SURVEY_TITLE_ID,
  	                    contentName:"modal",
  	                    text:"复制评分题",
  	                    icon:"file"
  	                }
            		eventBusService.publish(controllerName,'appPart.load.modal', m2);
	            }
	            
	            //复制主观题
	            $scope.copySubjective = function(obj) {
	            	var m2 = {
	                    url:"aps/content/questionnaire/edit/copy/subjective/config.json?pk="+obj.SURVEY_TITLE_ID,
	                    contentName:"modal",
	                    text:"复制主观题",
	                    icon:"file"
	                } 
	            	eventBusService.publish(controllerName,'appPart.load.modal', m2);	 
	            }
	            
	            //复制矩阵题
	            $scope.copyMatrix = function(obj) {
	             	var m2 = {
         				url:"aps/content/questionnaire/edit/copy/matrix/config.json?pk="+obj.SURVEY_TITLE_ID,
     	                contentName:"modal",
     	                text:"复制矩阵题",
     	                icon:"file"
     	            }
	                eventBusService.publish(controllerName,'appPart.load.modal', m2);	
	            }
             	
               	//返回事件	
            	$scope.goBack=function(){   
             		/*var m2 = {
         				  url:"aps/content/questionnaire/question/welcome/config.json?pk="+params.pk,
     	                  contentName:"content",
     	                  text:"返回问卷",
     	                  icon:"edit"
         	        }
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);*/
            		
            		var pk = sessionStorage.getItem('FK_COURSE');
            		var text = sessionStorage.getItem('COURSE_NAME');
             		var data = {};
             		data.MENU_PK = "none";
                    var m2 = {
                    		"url":"aps/content/myCourse/courseDetail/config.json?pk="+pk+"&text="+text,
        	                 "contentName":"content",
        	                 "hasButton":"none",
        	                 "data":data
        	            }   
  	                eventBusService.publish(controllerName,'appPart.load.content', m2);
            	}	
            	
	            //重新执行查询
            	eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
            	
            	$scope.find();
            	
            }
        ];
    });
}).call(this);
