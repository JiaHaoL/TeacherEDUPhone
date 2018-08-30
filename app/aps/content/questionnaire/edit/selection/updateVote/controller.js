(function() {
    define(['uploadauto','ZeroClipboard'], function() {
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
	           var content={};     
	           $scope.Ucontentlist.push(content);
	           
	           if(params.typeid == '6') {
	        	   $('.vote').show();
	           }else{
	        	   $('.vote input[type="text"]').attr("not-null","false");
	        	   $('.vote').hide();
	           }
	           
	           //添加      
		       $scope.addContent=function(){    	        	
	        	   var content={};       	
	        	   content.IS_DELETE=0;
	        	   $scope.Ucontentlist.push(content); 
		       }
	
	           //删除选项
	           $scope.removeContent=function(obj) { 
	         	  if($scope.Ucontentlist.length == 1) {
	          		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不可以被删除"});	//弹出提示框
	        	  }else{
		        	  obj.IS_DELETE = 1;
	        	  }
	          }
	           
	          //查询数据
	          $scope.find = function() { 	
	        	   $httpService.post(config.findTitleByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
	              		$scope.form = data.data;
	              		uetitle.ready(function(){
	                      	uetitle.execCommand('insertHtml',$scope.form.SURVEY_TITLE_NAME);
	                     	 $('.txtFiled textarea').val(uetitle.getPlainTxt());
	                      	$scope.$apply();
	              		});
	               });
	        	   
	               $httpService.post(config.findOptionListByPkURL, {"SURVEY_TITLE_ID":params.pk}).success(function(data) {
	            		$scope.Ucontentlist = data.data;
	            		for (var i = 0; i < $scope.Ucontentlist.length; i++) {
	            			$scope.Ucontentlist[i].IS_DELETE = 0;
						}
	        			$scope.$apply();
		           });	
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
          		  
          		  if($scope.form.MINIMUN_VALUE > $scope.Ucontentlist.length || $scope.form.MAXIMUN_VALUE > $scope.Ucontentlist.length) {
                  	  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"可选投票数不能超过参选人员数目。"});
                  	  return;
        		  }
        		  if($scope.form.MINIMUN_VALUE > $scope.form.MAXIMUN_VALUE) {
                  	  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"最少可投票数不能大于最多可投票数。"});
                  	  return;
        		  }
        		  
	        	  var questVo={};  	     	
	        	  //获取内容
	              var contentsVo=[];
	              for (var i = 0; i < $scope.Ucontentlist.length; i++) {      	 
	            	  var contentVo={};
	        	      contentVo.contentname=$scope.Ucontentlist[i].SURVEY_CONTENT_CHOOSE;
	        	      contentVo.contentid=$scope.Ucontentlist[i].SURVEY_CONTENT_ID;
	        	      contentVo.contentDef=$scope.Ucontentlist[i].IS_CHECKED;//获取选项是否选中
	        	      contentVo.isDelete=$scope.Ucontentlist[i].IS_DELETE;
	        	      contentsVo.push(contentVo);
	    		  }
	         
	              questVo.titleid=$scope.form.SURVEY_TITLE_ID;
	              questVo.titlename=uetitle.getContent();        //获取文本框中的值
	              questVo.titleTxt = uetitle.getPlainTxt();
	              questVo.titlechecked=$scope.form.IS_CHECKED;//获取题目是否是必答题
	              if(params.typeid == '6') {
		              questVo.titleMaxValue=$scope.form.MAXIMUN_VALUE;//题目最多可选数目
		              questVo.titleMinValue=$scope.form.MINIMUN_VALUE;//题目至少可选数目
	              }else{
	            	  questVo.titleMaxValue=null;
		              questVo.titleMinValue=null;
	              }
	              questVo.conten=contentsVo;

	        	  $httpService.post(config.updatetitleURL, {data:JSON.stringify(questVo)}).success(function(data) {
		    			if(data.code=="0000"){
		        			eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
		        			eventBusService.publish(controllerName,'appPart.data.reload', {"scope":"site"});
		            		eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改成功!"});	                		
		    			}else{
		    				eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改失败!"});
		    			}
	        	  }).error(function(data) {
		            	eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"修改出错!"});
	              }); 
	         });
          
	         //接收关闭按钮事件
	      	 eventBusService.subscribe(controllerName, controllerName+'.close', function(event, btn) {
	            	eventBusService.publish(controllerName,'appPart.load.modal.close', {contentName:"modal"});
	      	 });
          
			 //上移
			 $scope.updata=function(obj){	
				  if(obj>0){
					  var temp=$scope.Ucontentlist[obj-1];
					  $scope.Ucontentlist[obj-1]=$scope.Ucontentlist[obj];
					  $scope.Ucontentlist[obj]=temp;  
				  }
			  }
          
			  //下移
			  $scope.downdata=function(obj){
				  if(obj<$scope.Ucontentlist.length-1){
					  var temp=$scope.Ucontentlist[obj+1];
					  $scope.Ucontentlist[obj+1]=$scope.Ucontentlist[obj];
					  $scope.Ucontentlist[obj]=temp;
				  }			 
			  }
        		
	    	  //重新查询
	    	  $scope.find();
	    	  
	    	  //初始化表单校验
	    	  VALIDATE.iniValidate($scope);
        		
           }
       ];
    });
}).call(this);
