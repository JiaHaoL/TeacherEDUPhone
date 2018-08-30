(function() {
    define(['ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	
          //标题  	
           $scope.form={};
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
           
            //内容
            $scope.Ucontentlist=[];
     	       
            //查询数据
            $scope.find = function() { 	
            	$httpService.post(config.findTitleByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
            		$scope.form = data.data;
            		uetitle.ready(function(){
                     	 uetitle.setContent($scope.form.SURVEY_TITLE_NAME); 
                 		 $('.txtFiled textarea').val(uetitle.getPlainTxt());
             		});
            		console.log();
	            });
            	
            	$httpService.post(config.findOptionListByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
            		$scope.Ucontentlist = data.data;	
        			$scope.$apply();
	            });
            }
          
            //接收保存按钮事件 	     
            eventBusService.subscribe(controllerName, controllerName+'.save', function(event, btn) {  
        		if(!editorIsDel) {
        			uetitle.setContent($('.txtFiled textarea').val().replace(/\n/g,"<br/>"),false);
        		}
        	    var questVo={};  	     	
                //获取内容
                var contentsVo=[];
                for (var i = 0; i < $scope.Ucontentlist.length; i++) {      	 
            	    var contentVo={};
        	        contentVo.contentname=$scope.Ucontentlist[i].SURVEY_CONTENT_CHOOSE;
        	        contentVo.contentid=$scope.Ucontentlist[i].SURVEY_CONTENT_ID;
        	        contentVo.contentDef=$scope.Ucontentlist[i].IS_CHECKED;//获取选项是否选中
        	        contentsVo.push(contentVo);
    		    }
	            questVo.titleid=$scope.form.SURVEY_TITLE_ID;
	            questVo.titlename=uetitle.getContent();
	            questVo.titleTxt=uetitle.getPlainTxt();
	            questVo.titlechecked=$scope.form.IS_CHECKED;//获取题目是否是必答题
	            questVo.conten=contentsVo;                   
            	$httpService.post(config.updatetitleURL, {data:JSON.stringify(questVo)}).success(function(data) { 
        			if(data.code=="0000"){
            			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
                		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"主观题修改成功!"});	                		
        			}else{
        				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"主观题修改失败!"});
        			}
        		}).error(function(data) {
	            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"主观题修改出错!"});
                });   		
	        });
             
        	//接收关闭按钮事件
        	eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
              	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
            });
            	
        	//重新查询
        	$scope.find();
        	//初始化表单校验
        	VALIDATE.iniValidate($scope);
            }
        ];
    });
}).call(this);
