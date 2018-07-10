(function() {
    define(['jwplayer','videourl'], function() {
        return [
            '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	loggingService.info(controllerName,"loaded");
            	$scope.form={};
            	$scope.comment={};
                var videopk = params.videopk;
                var SC_COURSE_PK = params.pk;
                $scope.form.SC_COURSE_PK = params.pk; 
                var FK_SC_VIDEO = "";
                $scope.action = params.action;
                
                var videoShow = function(SC_VIDEO_PK){
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
        	           		//playpath = VIDEO.returnURL(path);
                    		//initPlayer(playpath);
//                    		//thePlayer.seek(begintime);
        	           		media = document.getElementById("media");
        	           		
        	           		playpath = "http://livev.sjedu.cn:1935/vod/_definst_/mp4:"+path+"/playlist.m3u8";
        	           		media.src=playpath;
	        	           	media.load();
	               			$scope.$apply();
        	           		
                    	}
                    }).error(function(data) {
                        loggingService.info('查询失败！');
                    });
                }
                
                $scope.tabclick = function(obj){
                	$('#'+controllerName+' .webvideo').removeClass('active');
                	$('#'+controllerName+' .res_list').show();
                	$('#'+controllerName+' .res_view').hide();
                	if(obj==1){
                		$('#'+controllerName+' .tab_kejian').addClass('active');
                		$('#'+controllerName+' .kejian_list').hide();
            			$('#'+controllerName+' .jiaoan_list').show();
                	}else{
                		$('#'+controllerName+' .tab_jiaoan').addClass('active');
                		$('#'+controllerName+' .kejian_list').show();
            			$('#'+controllerName+' .jiaoan_list').hide();
                	}
                }
                
                
                
                var init = function(){
                	videoShow(videopk);
                	
                	$httpService.post(config.loadStudyResURL,$scope.form).success(function(data) {
	                 	if(data.code != '0000'){
	                 		loggingService.info(data.msg);
	                 	}else{
	                 		var resattrList = data.data;
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
	                 		
	                 		$scope.resList = data.data;
	                 		$scope.$apply();
	                 		//PAGE.buildPage($scope,data);
	                 	}
	                  }).error(function(data) {
	                      loggingService.info('获取学习课件异常');
	                  });
                }
                init();
                
                
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
