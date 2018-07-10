(function() {
    define(['jwplayer','videourl'], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var videopk = params.videopk;
                var SC_COURSE_PK = params.pk;
                var FK_SC_VIDEO = "";
                $scope.action = params.action;
                
                
                $scope.videoplay = function(starttime,SC_VIDEO_POINT_PK){
                	if(starttime==-1){
                		thePlayer.stop();
                		var m2 = {
                  			  url:"aps/content/webVideo/config.json?pk="+SC_COURSE_PK+"&action=1&videopk="+videopk,
            	                  contentName:"modal",
            	                  text:"WEB视频课堂",
            	                  size:"modal-big"
            	                }
                      	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                	}else{
                		if (thePlayer.getState() != 'PLAYING') {    //若当前未播放，先启动播放器
            	            thePlayer.play();
            	        }
            	        thePlayer.seek(starttime); //从指定位置开始播放(单位：秒)
            	        FK_SC_VIDEO_POINT = SC_VIDEO_POINT_PK;
            	        $scope.page.current = 1;
            	        $scope.find();
                	}
                }
                
                var videoShow = function(SC_VIDEO_PK,begintime){
                	$httpService.post(config.findScVideoURL, {
                        "SC_VIDEO_PK":SC_VIDEO_PK
                    }).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.video = data.data[0];
                    		//初始化参数
        	           		// ip，端口，项目名
        	           		VIDEO.initParam("livev.sjedu.cn","1935","vod/_definst_");
                            
        	           		//传入资源路径，返回符合设备播放的url
        	           		var path = $scope.video.VIDEO_URL;
        	           		path = path.substring(1,path.length);
        	           		
//        	           		playpath = VIDEO.returnURL(path);
//                    		initPlayer(playpath);
//                    		thePlayer.seek(begintime);
                            media = document.getElementById("media");
        	           		playpath = "http://livev.sjedu.cn:1935/vod/_definst_/mp4:"+path+"/playlist.m3u8";
        	           		media.src=playpath;
        	           		media.currentTime = begintime;
	        	           	media.load();
	               			$scope.$apply();
                    		
                    		
                    	}
                    }).error(function(data) {
                        loggingService.info('查询失败！');
                    });
                }
                
                /**
                 * 保存教课反思
                 */
                $scope.saveTeachingreflection = function(){
                	$scope.comment.FK_SC_VIDEO_POINT = FK_SC_VIDEO_POINT;
                	if($scope.comment.TEACHERCOMMENT.length<300){
                		 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"教后反思必须300字以上"});	//弹出提示框
                		return;
                	}
                	$httpService.post(config.scVideoCommentInsertURL,$scope.comment).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		$scope.find();
                    		$scope.comment.TEACHERCOMMENT="";
                    	}
                     }).error(function(data) {
                         eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"提交失败"});	//弹出提示框
                     });
                }
                
                
                /**
                 * 预览视频
                 */
                $scope.priviewVideo = function(obj){
                	var m2 = {
      	                  url:"aps/content/myCourse/priviewVideo/config.json?SC_VIDEO_PK="+FK_SC_VIDEO,
      	                  contentName:"modal",
      	                  text:"视频预览",
      	                  size:"modal-lg",
      	                  icon:"bullhorn"
      	                }
                	eventBusService.publish(controllerName,'appPart.load.modal', m2);
                }
                

                
                /**
                 * 返回切片评课
                */
                $scope.backVideoPoint = function(){
                	thePlayer.stop();
                	var m2 = {
      	                  url:"aps/content/myCourse/courseDetail/video/config.json?pk="+params.pk+"&action="+params.action+"&treeid="+params.treeid,
      	                  contentName:"content"
      	                }
                    eventBusService.publish(controllerName,'appPart.load.courseDetail.content', m2);
                	
                }
                
                  /**
                   * 加载评课内容
                   */
                  //var loadVideoPointComment = function(obj){
                   $scope.find = function(){
                	  dataType=99;
                	  $scope.form.FK_SC_VIDEO_POINT = FK_SC_VIDEO_POINT;
                	  $scope.form.page = JSON.stringify($scope.page);
                	  $httpService.post(config.findScVideoCommentURL,$scope.form).success(function(data) {
                      	if(data.code != '0000'){
                      		loggingService.info(data.msg);
                      	}else{
                      		 $scope.videoPointCommentList = data.data;
                      		 $scope.commentsize = $scope.videoPointCommentList.length;
                      		 PAGE.buildPage($scope,data);
                      	}
                       }).error(function(data) {
                           loggingService.info('获取通告异常');
                       });
                  }

                /**
                 * 进入 切片 评课反思
                 */
                var findVideoPoint = function(){
                	FK_SC_VIDEO = videopk;
                	$httpService.post(config.findScVideoPointURL,{"FK_SC_VIDEO":videopk}).success(function(data) {
                		if(data.code="0000"){
                			$scope.videopointlist = data.data;
                			$scope.$apply();
                			if($scope.videopointlist.length>0){
                				for(var i=0;i<$scope.videopointlist.length;i++){
                					$scope.videopointlist[i].beginTime = getVideoTime($scope.videopointlist[i].BEGIN_TIME);
                					$scope.videopointlist[i].endTime = getVideoTime($scope.videopointlist[i].END_TIME);
                       		    }
                				if($scope.action==1){
                					$('#'+controllerName+' .videopointliebiao').hide();
                					$('#'+controllerName+' .priviewVideo').show();
                				}else{
                					$('#'+controllerName+' .priviewVideo').hide();
                				}
                				$('#'+controllerName+' .govideolist').hide();
                				$httpService.post(config.findScVideoPointSynopsis,{"SC_VIDEO_POINT_PK":data.data[0].SC_VIDEO_POINT_PK}).success(function(data) {
                                	if(data.code != '0000'){
                                		loggingService.info(data.msg);
                                	}else{
                                		$scope.synopsis = data.data;
                                		$scope.synopsis.beginTime = getVideoTime($scope.synopsis.BEGIN_TIME);
                    					$scope.synopsis.endTime = getVideoTime($scope.synopsis.END_TIME);
                                		
                                		
                                		//console.log(data.data);
                                		//加载视频：
                                        videoShow(videopk,$scope.synopsis.BEGIN_TIME);
                                	}
                                 }).error(function(data) {
                                     console.log("删除切片失败");
                                 });
                            	FK_SC_VIDEO_POINT = data.data[0].SC_VIDEO_POINT_PK;
                            	if($scope.page==null || $scope.page==undefined || $scope.page==""){
                            		PAGE.iniPage($scope);
                            	}else{
                            		$scope.find();
                            	}
                			}else{
                				$('#'+controllerName+' .video_pointdetail').hide();
                				//加载视频：
                                videoShow(videopk,0);
                			}
                			
                		}
                		
                	}).error(function(data) {
                        console.log("删除切片失败");
                    });
                	
                	
                	
                }
                
                /**
                 * 删除切片
                */
                $scope.deleteVideoPoint = function(obj){
                	$httpService.post(config.scVideoPointDeleteURL,{"SC_VIDEO_POINT_PK":obj}).success(function(data) {
                    	if(data.code != '0000'){
                    		loggingService.info(data.msg);
                    	}else{
                    		console.log("删除切片成功！FK_SC_VIDEO="+FK_SC_VIDEO);
                    		$httpService.post(config.findScVideoPointURL,{"FK_SC_VIDEO":videopk}).success(function(data) {
                        		if(data.code="0000"){
                        			$scope.videopointlist = data.data;
                        			if($scope.videopointlist.length>0){
                        				for(var i=0;i<$scope.videopointlist.length;i++){
                        					$scope.videopointlist[i].beginTime = getVideoTime($scope.videopointlist[i].BEGIN_TIME);
                        					$scope.videopointlist[i].endTime = getVideoTime($scope.videopointlist[i].END_TIME);
                               		    }
                        			}
                        			$scope.$apply();
                        		}
                     }).error(function(data) {
                         console.log("删除切片失败");
                     });
                 }
               });
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
                
                
                var init = function(){
                	getUserInfo();
                	findVideoPoint();
                }
                init();
                
                
                eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, m2) {
                	console.log(m2);
                	if(m2.scope=="courseDetail"){
                        if(m2.type=="videopoint"){//切片评课
                        	$scope.videoPointReview(FK_SC_VIDEO);
                    	}else if(m2.type=="video"){
                    		$scope.find();
                    	}
                	}
                });
            	
            	
            	var getVideoTime = function(min){
            		var str="";
            		if(min==undefined){
            			return str;
            		}
            		if(min<60){
            			str = "00:00";
            			if(min<10){
            				str =str+ ":0"+min;
            			}else{
            				str =str+ ":"+min;
            			}
            		}else{
            		    var s = parseInt(min/60);
            		    str = "00";
            		    if(s<60){
            		    	if(s<10){
                				str =str+":0"+s;
                			}else{
                				str =str+":"+s;
                			}
            		    }
            		    if((min-s*60)<10){
            		    	str =str+ ":0"+(min-s*60);
            			}else{
            				str =str+ ":"+(min-s*60);
            			}
            		}
            		return str;
            	}
            	
            	var thePlayer;  //保存当前播放器以便操作
            	var playpath = "";
            	var initPlayer = function(playpath) {
            	    thePlayer = jwplayer('container_video').setup({
            	        flashplayer: 'js/jwplayer/jwplayer.flash.swf',
            	        file: playpath,
            	        width: '100%',
            	        aspectratio:"16:9",//自适应宽高比例，如果设置宽高比，可设置宽度100%,高度不用设置
            	        autostart:true,
            	        dock: false
            	    });
            	  //播放 暂停
                	$('.player-play').click(function() {
                	        if (thePlayer.getState() != 'PLAYING') {
                	            thePlayer.play(true);
                	            this.value = '暂停';
                	        } else {
                	            thePlayer.play(false);
                	            this.value = '播放';
                	        }
                	    });
                	    
                	    //停止
                	    $('.player-stop').click(function() { thePlayer.stop(); });
                	    
                	    //获取状态
                	    $('.player-status').click(function() {
                	        var state = thePlayer.getState();
                	        var msg;
                	        switch (state) {
                	            case 'BUFFERING':
                	                msg = '加载中';
                	                break;
                	            case 'PLAYING':
                	                msg = '正在播放';
                	                break;
                	            case 'PAUSED':
                	                msg = '暂停';
                	                break;
                	            case 'IDLE':
                	                msg = '停止';
                	                break;
                	        }
                	    });
                	    
                	    //获取播放进度
                	    $('.player-current').click(function() { alert(thePlayer.getPosition()); });

                	    //跳转到指定位置播放
                	    $('.player-goto').click(function() {
                	        if (thePlayer.getState() != 'PLAYING') {    //若当前未播放，先启动播放器
                	            thePlayer.play();
                	        }
                	        thePlayer.seek(30); //从指定位置开始播放(单位：秒)
                	    });
                	    
                	    //获取视频长度
                	    $('.player-length').click(function() { alert(thePlayer.getDuration()); });
            	}
            	
            }
        ];
    });
}).call(this);
