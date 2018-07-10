(function() {
    define([], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
                var pk = params.pk;
                var action = params.action;
                var treeid = params.treeid;
                
                /**
                * 上传课件
                */ 
                $scope.uploadRES = function(){
                	var m2 = {
      	                  url:"aps/content/myCourse/upload-uploadify/config.json?pk="+pk+"&UserID="+$scope.userInfo.GUID+"&FK_UNIT="+$scope.userInfo.FK_UNIT+"&treeid="+treeid+"&atcion=1",
      	                  contentName:"modal",
      	                  text:"上传课件",
      	                  icon:"upload",
      	                  size:"modal-lg"
      	                }
                	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                
                /**
                 * 下载学习课件
                 */
                $scope.downloadRes = function(obj){
                	window.open(config.downloadurl+"?filelinkid="+obj+"&uploadapp=jsjy","资源下载");
                }
                
                /**
            	 * 得到当前用户信息
            	 */
                var getUserInfo = function(){
                	$httpService.post(config.getUserInfoURL,{}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.userInfo = data.data;
                    	}
                     }).error(function(data) {
                         loggingService.info('获取当前用户出错');
                     });
                };
                
                
                eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, m2) {
                	if(m2.scope=="courseDetail"){
                        if(m2.type=='resstudy'){
                        	$scope.find();
                    	}
                	}
                	
                	
                });
                
                
                var init = function(){
                	getUserInfo();
                }
                init();
                
                $scope.find = function(){
                	$scope.form.SC_COURSE_PK = pk;
            		$scope.form.FK_SC_COURSE = pk;
            		$scope.form.page = JSON.stringify($scope.page);
            		$httpService.post(config.loadStudyResURL,$scope.form).success(function(data) {
	                    if(data.code != '0000'){
	                    		loggingService.info(data.msg);
	                    }else{
	                    	if(action==1){
	                   			   $('#'+controllerName+' .uploadRES').show();
	                             }else{
	                           	   $('#'+controllerName+' .uploadRES').hide();
	                        	 }
	                    	
	                    	var resattrList = data.data;
	                    	//console.log(resattrList);
	                		for(i=0;i<resattrList.length;i++){
	                			var bgurl=data.data[i].FILEPATH;
	                			var extname = data.data[i].EXTNAME;
	                		    bgurl = bgurl+"/"+data.data[i].FILE_ID+"."+extname;
	                			if(bgurl !=undefined){
	                				if(extname=='doc' || extname == 'pdf'|| extname=='docx' || extname=='ppt' || extname=='pptx' || extname=='xls' || extname=='xlsx'){
		                					bgurl = bgurl.replace("/ResCenter/ResourceData", "/Thumbnail/L_Thumbs");
		                    				var str = bgurl.split("/");
		                    				var extname =data.data[i].EXTNAME;
		                    				bgurl = bgurl.replace("/"+str[3], "");
		                    				bgurl = bgurl.replace("."+extname, ".jpg"); 
		        	                		bgurl = "data"+bgurl;
	                				}else if(extname=='mp4'){
	                					bgurl = bgurl.replace("/ResCenter/ResourceData/MP4", "/ConvertJPG");
	                					bgurl = bgurl.replace("mp4", "jpg");
	                					bgurl = "data"+bgurl;
	                				}else{
	                					bgurl = "assets/img/default.jpg";
	                				}
	                				
	                			}
		                		data.data[i].IDENTIFIER = "http://rescenter.sjedu.cn/ResCenter/"+bgurl;
	                		}
	                		$scope.resList = data.data;
	                         //console.log(data);
	                         PAGE.buildPage($scope,data);
	                         
	                         
	                         
	                         
                    	}
                    }).error(function(data) {
                         loggingService.info('获取学习课件异常');
                    });
                }


            	PAGE.iniPage($scope);
            	
            }
        ];
    });
}).call(this);
