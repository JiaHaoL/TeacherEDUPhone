(function() {
    define(['uploadauto','ZeroClipboard'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
	    	   //PC图片上传初始化
	    	   $httpService.css("assets/js/jquery.uploadify-v2.1.0/uploadify.css"); //样式
	    	   var uploadfiletype = "*.jpg,*.png";                                  //限制图片上传的类型
	    	   var uploadapp = "wjdc";                                              //
	    	   var UserID = "";                                                     //
	    	   var url = config.uploadurl;     
	    	  
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
	           
	           //回调函数（判断图片上传）  
	           var callonComplete = function(event, queueID, fileObj, response, dataObj){
	           	    //转换为json对象
	                var data = eval("("+response+")");
	                var index = $('#uploadIndex').val();
	                if(data.code=="0000"){
	                     $scope.Ucontentlist[index].SURVEY_CONTENT_IMG = data.data.RES_FILE_LINK_PK;
	                     $scope.Ucontentlist[index].IMAGE_WIDTH = '40';
	                     $scope.Ucontentlist[index].IMAGE_HEIGHT = '40';
	                     $scope.$apply();
	         	    }else if(data.code=="4444"){
	         	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"不支持此文件类型的上传，只支持"+uploadfiletype+"类型文件上传"});	//弹出提示框
	         	    }else{
	         	        eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"上传文件处理失败！"});	//弹出提示框
	         	    }
	           };
	           
	           //添加      
		       $scope.addContent=function(){    	        	
	        	   var content={};       	
	        	   content.IS_DELETE=0;
	        	   $scope.Ucontentlist.push(content); 
	
	              	if(params.typeid == '1' || params.typeid == '5' || params.typeid == '4') {
	               		$('input[name="choice"]').prop("checked",false); 
	               		for (var i = 0; i < $scope.Ucontentlist.length; i++) {
	               			$scope.Ucontentlist[i].IS_CHECKED = false;
						}
	               	}
		       }
		       
	           //单选题默认值只能选中一个
	           $scope.optionIsDefault = function(idx) {
		           	if(params.typeid == '1' || params.typeid == '5' || params.typeid == '4') { 
		           		 $('input[name="choice"]').not(this).attr("checked", false);
		           		 //设置复选框只能选中一个值
		           		 $('input[name="choice"]').bind('click', function(){
		           		      $('input[name="choice"]').not(this).attr("checked", false);
		           		 });
		           	}
               		for(var i = 0; i < $scope.Ucontentlist.length; i++) {
              			 if(idx == i) {
              				$scope.Ucontentlist[i].IS_CHECKED = true;
              			 }else{
	               			$scope.Ucontentlist[i].IS_CHECKED = false;
              			 }
					}
	           }
	
	           //删除选项
	           $scope.removeContent=function(obj) { 
	         	  if($scope.Ucontentlist.length == 1) {
	          		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"选项不可以被删除"});	//弹出提示框
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
                  	  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"可选择项数不能超过选项数目。"});
                  	  return;
        		  }
        		  if($scope.form.MINIMUN_VALUE > $scope.form.MAXIMUN_VALUE) {
                  	  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"至少可选择项数不能大于最多可选择项数。"});
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
	        	      contentVo.contentImg=$scope.Ucontentlist[i].SURVEY_CONTENT_IMG;     //获取图片
	        	      contentVo.imageWidth=$scope.Ucontentlist[i].IMAGE_WIDTH;
	        	      contentVo.imageHeight=$scope.Ucontentlist[i].IMAGE_HEIGHT;
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
	     	  //PC图片上传初始化时
        	
          	  //图片初始化
        	  $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {   
        	 	  for(var i = 0; i < $scope.Ucontentlist.length; i++) {	
        			  if($scope.Ucontentlist[i].hasFileBtn){
        				
        			  }else{
        				 $scope.Ucontentlist[i].hasFileBtn = true;		
        				 UPLOADAUTO.iniUploadauto($('#uploadify'+i),uploadfiletype,uploadapp,0,UserID,url,callonComplete,i);      
        			  }
			 	  }          		
        	  }); 	
           }
       ];
    });
}).call(this);
