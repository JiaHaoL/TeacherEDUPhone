(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {		
            	//初始化
            	$scope.form = {}; //题目
            	$scope.form.SURVEY_TITLE_QUE = true;
            	
            	UE.delEditor('titlename');
            	var uetitle = UE.getEditor('titlename');
            	var editorIsDel = false;
                //创建编辑器
                $scope.showEditor = function() {
                	$('#titlename').show();
                	editorIsDel = true;
                	$('.txtFiled').attr("style","display:none");
                	$('.pictxt').hide();
                	$('.txt').show();
                	uetitle.ready(function() { 
                		uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);	
              		});
                }
                
                //删除编辑器
                $scope.hideEditor = function() {
                	console.log(uetitle.getContent());
                	$('#titlename').hide();
                	editorIsDel = false;
                	$('.txtFiled').attr("style","display:block");
                	$('.pictxt').show();
                	$('.txt').hide();
                	$('.txtFiled textarea').val(uetitle.getPlainTxt());
				}
                
            	//内容部分
            	$scope.contents = [];
            	var content1 = {};
            	content1.SURVEY_CONTENT_CHOOSE = "很满意";
            	var content2 = {};
            	content2.SURVEY_CONTENT_CHOOSE = "满意";
            	var content3 = {};
            	content3.SURVEY_CONTENT_CHOOSE = "一般";
            	var content4 = {};
            	content4.SURVEY_CONTENT_CHOOSE = "不满意";
             	$scope.contents.push(content1);
             	$scope.contents.push(content2);
             	$scope.contents.push(content3);
             	$scope.contents.push(content4);
             	
                //添加
                $scope.addContent = function(){
 	               	var content = {};
 	               	$scope.contents.push(content);      
                }
                
               //删除	
               $scope.removeContent = function(obj){
             	  if($scope.contents.length == 1) {
              		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选项不可以被删除"});	//弹出提示框
            	  }else{
            		  $scope.contents.remove(obj);
            	  }
               }
               
               //插入行标题
               $scope.addLineHeading = function() {
            	   if($scope.form.LINE_HEADING == undefined || $scope.form.LINE_HEADING == null) {
            		   $scope.form.LINE_HEADING = "行标题";
            	   }else{
            		   $scope.form.LINE_HEADING += "\n行标题";
            	   }
               }
               
               //接收保存按钮事件
               eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {
            		//校验表单
            		if(!$scope.validateForm()){
            			return;
            		}  
            		if(!editorIsDel) {
            			uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);
            		}
            		
            	    if($scope.form.LINE_HEADING == null || $scope.form.LINE_HEADING == "") {
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"行标题不能为空。"});
            	    	return;
            	    }
            	    
            		$scope.form.SURVEY_QUEST_ID=params.pk;
            		$scope.form.SURVEY_TYPE_ID=params.id;

            		$scope.form.SURVEY_TITLE_NAME=uetitle.getContent();   //获取富文本框里面的值
            		$scope.form.SURVEY_TITLE_TXT = uetitle.getPlainTxt();
            		$scope.form.contents=JSON.stringify($scope.contents);//转json格式           		

            		$httpService.post(config.addURL, $scope.form).success(function(data) {
            			if(data.code=="0000"){
	            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});	//关闭模态窗口
	            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"title"});	//刷新范围的数据
	                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增成功"});	//弹出提示框
            			}
    	            }).error(function(data) {
    	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"新增出错"});	//弹出提示框
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
