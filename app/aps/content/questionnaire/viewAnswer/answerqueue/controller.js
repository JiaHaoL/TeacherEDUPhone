(function() {
    define(['pageController'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};  	
                $scope.form.SURVEY_QUEST_ID = params.pk;
                
                //查询数据
            	$scope.find = function() { 
	                $scope.form.page = JSON.stringify($scope.page);
	                //答案列表查询
	            	$httpService.post(config.findAnswerListURL, $scope.form).success(function(data) {
	            		$scope.answerList = data.data;
	            		PAGE.buildPage($scope,data);	//处理分页
	            		$scope.$apply();
		            });
            	}
            	
            	$scope.select = function() {
            		$scope.page.current = 1;
            		$scope.find();
            	}
            	
                //查看答案
                $scope.seeAnswer = function(obj) {         
            		var m2 = {
						  url:"aps/content/questionnaire/viewAnswer/answer/config.json?pk="+obj.SURVEY_QUEST_ID+
						  	"&uuid="+obj.SURVEY_SUBJECTTEACHER_ID+"&userPk="+obj.FK_USER+"&teacherName="+obj.TEACHER_NAME,
						  contentName:"content",
						  text:"问卷答题",
						  icon:"edit"
        	        }
                  	eventBusService.publish(controllerName,'appPart.load.content', m2);
            	} 
                
                //返回事件
            	$scope.goBack=function(){ 
             		/*var m2 = {
         				  url:"aps/content/questionnaire/question/welcome/config.json?pk="+params.pk,
     	                  contentName:"content",
     	                  text:"返回问卷",
     	                  icon:"edit"
         	        }
                   	eventBusService.publish(controllerName,'appPart.load.content', m2);	*/
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
            	
            	//删除
            	$scope.remove=function(obj){
            	     $httpService.post(config.deleteAnswer, {"SURVEY_ANSWER_ID":obj.SURVEY_ANSWER_ID}).success(function(data) {            			
 	                	if(data.code=="0000"){
             				$scope.find();
                 			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
                     		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除成功"});
             			}
     	            }).error(function(obj) {
     	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"删除出错"});
                     }); 
            	}
            	
            	//接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
	            //初始化分布
	            PAGE.iniPage($scope);
            }
        ];
    });
}).call(this);
