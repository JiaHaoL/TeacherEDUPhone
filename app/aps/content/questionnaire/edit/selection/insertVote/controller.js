(function() {
    define(['uploadauto','ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	//初始化
            	$scope.form = {};  
            	$scope.form.SURVEY_TITLE_QUE = true;
            	$scope.form.SURVEY_TYPE_ID = params.id;
            	
            	UE.delEditor('titlename');
            	var uetitle = UE.getEditor('titlename');
                var editorIsDel = false;
                //创建编辑器
                $scope.showEditor = function() {
                	uetitle.setContent("");
                	$('#titlename').show();
                	editorIsDel = true;
                	$('.txtFiled').attr("style","display:none");
                	$('.pictxt').hide();
                	$('.txt').show();
                	uetitle.ready(function(){ 
                		uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);		
              		});
                }
                
                //删除编辑器
                $scope.hideEditor = function() {
                	$('#titlename').hide();
                	editorIsDel = false;
                	$('.txtFiled').attr("style","display:block");
                	$('.pictxt').show();
                	$('.txt').hide();
                	$('.txtFiled textarea').val(uetitle.getPlainTxt());
				}
                
            	//内容部分
            	$scope.contents = [];
            	var content = {};
             	$scope.contents.push(content);
             	
 	            if($scope.form.SURVEY_TYPE_ID == '6') {
	        	    $('.vote').show();
	            }else{
	        	    $('.vote input[type="text"]').attr("not-null","false");
	        	    $('.vote').hide();
	            }
            	
             	//添加
             	$scope.addContent = function(){
	               	var content = {};
	               	$scope.contents.push(content);      
             	}
             	
             	//删除	
             	$scope.removeContent = function(obj){
             		if($scope.contents.length == 1) {
              		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不可以被删除!"});	//弹出提示框
             		}else{
            		  $scope.contents.remove(obj);
             		}
             	}  	
               
               //接收保存按钮事件
               eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            	   console.log($scope.form);
            	   	//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}  
            		if(!editorIsDel) {
            			uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);
            		}
            		
            		if($scope.form.SURVEY_TYPE_ID == '6') {
	            		if($scope.form.MINIMUN_VALUE > $scope.contents.length || $scope.form.MAXIMUN_VALUE > $scope.contents.length) {
	                      	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"可投票数不能超过参选人员数目。"});
	                      	return;
	            		}
	            		if($scope.form.MINIMUN_VALUE > $scope.form.MAXIMUN_VALUE) {
	                      	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"最少可投票数不能大于最多可投票数。"});
	                      	return;
	            		}
            		}
            		
            		$scope.form.SURVEY_QUEST_ID=params.pk;
  
            		$scope.form.SURVEY_TITLE_NAME=uetitle.getContent();   //获取富文本框里面的值
            		$scope.form.SURVEY_TITLE_TXT = uetitle.getPlainTxt();
            		$scope.form.contents=JSON.stringify($scope.contents);//转json格式   

            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
	            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"title"});	//刷新范围的数据
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增成功!"});	//弹出提示框
            			}else{
            				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增失败!"});
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增出错!"});	//弹出提示框
                    });
            		
	            });
               
               	//上移
      		  	$scope.updata=function(obj){	
      		  		if(obj>0){
      		  			var temp=$scope.contents[obj-1];
      		  			$scope.contents[obj-1]=$scope.contents[obj];
      		  			$scope.contents[obj]=temp;  
      			  	}
      		  	} 
      		  	//下移
      		  	$scope.downdata=function(obj){	
      		  		if(obj<$scope.contents.length-1){
      		  			var temp=$scope.contents[obj+1];
      		  			$scope.contents[obj+1]=$scope.contents[obj];
      		  			$scope.contents[obj]=temp;  
      		  		}
      		  	}      		  
      		  	//接收关闭按钮事件
            	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
                  	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	            });
            		
            	//初始化表单校验
            	VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
