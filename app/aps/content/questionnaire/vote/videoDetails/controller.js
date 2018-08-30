(function() {
    define(['jwplayer','videourl','jwplayerHtml5'], function() {
        return [
            '$scope','httpService','config','params','$routeParams','eventBusService','controllerName','loggingService', 
            function($scope,$httpService,config,params,$routeParams,eventBusService,controllerName,loggingService) {
            	$scope.form = {};
            	$scope.form.EXPAND_INFO_PK = $routeParams.pk;
            	$scope.form.SURVEY_QUEST_ID = $routeParams.qsPk;
            	
            	//查询数据
            	$scope.find = function() { 
                	$httpService.post(config.findExpandInfoByIdURL, {
                		"EXPAND_INFO_PK":$scope.form.EXPAND_INFO_PK,
                		"SURVEY_QUEST_ID":$scope.form.SURVEY_QUEST_ID
                	}).success(function(data) {
                		$scope.dataInfo = data.data;
                		$scope.filePreview($scope.dataInfo.EXPAND_VIDEO,$scope.dataInfo.EXPAND_VIDEO_IMG);
                		$scope.$apply();
    	            });	
            	}   
            	
            	$scope.filePreview = function(fileLinkId, imgLinkId) {
            		//IE9以及以下不支持跨域，需添加这个
            		jQuery.support.cors = true;
            		$httpService.post(config.previewURL, {
            			uploadapp:"wjdc",
	                    filelinkid:fileLinkId
            		}).success(function(data) {
	  	            	if(data.code=="0000") {
	  	            		var obj = data.data.CONTENTTYPE;
	  	            		var filePath = data.data.FILEPATH;
	  	            		//初始化参数
	        	           	// ip，端口，项目名
	  	            		VIDEO.initParam("livev.sjedu.cn","1935","vod");

	        	           	//传入资源路径，返回符合设备播放的url
	        	           	playPath = VIDEO.returnURL(filePath);
	        	           	var str = playPath.substr(playPath.length-4);
        	           		if(str == "m3u8"){
        	           			//filepath = filepath.substring(1,filepath.length);
        	           			playPath = "http://livev.sjedu.cn:1935/vod/_definst_/mp4:"+filePath+"/playlist.m3u8";
	         	           		console.log(playPath);
  	            	        }
	        	           	initPlayer(playPath, imgLinkId);
        	           		//initPlayer(config.httpURL+"/data/"+filepath);
	  	            	}
	  	          	});
            		
            	};
            	
            	var thePlayer;  //保存当前播放器以便操作
            	var initPlayer = function(playPath,imgLinkId) {
            	    thePlayer = jwplayer('container').setup ({
//            	        flashplayer: 'assets/js/jwplayer/jwplayer.flash.swf',
            	        file: playPath,
            	        image:config.getFileURL+imgLinkId,
            	        width: 800,
            	        height: 450,
            	        aspectratio:"16:9",//自适应宽高比例，如果设置宽高比，可设置宽度100%,高度不用设置
            	        autostart:false,
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
            	
               	var initFlexpaper = function(swfpath) {
            		var fp = new FlexPaperViewer (	  
            	         'js/FlexPaper/FlexPaperViewer', 
            	         'viewerPlaceHolder',
            	         { 
            	        	 config : {  
		            	         SwfFile : escape(swfpath),  
		            	         Scale : 1,  
		            	         ZoomTransition : 'easeOut',  
		            	         ZoomTime : 0.5,  
		            	         ZoomInterval : 0.2,  
		            	         FitPageOnLoad : true,  
		            	         FitWidthOnLoad : true,  
		            	         FullScreenAsMaxWindow : false,  
		            	         ProgressiveLoading : true,  
		            	         MinZoomSize : 0.2,  
		            	         MaxZoomSize : 1,  
		            	         SearchMatchAll : true,  
		            	         InitViewMode : 'Portrait',  
		            	         PrintPaperAsBitmap : false,  
		            	         ViewModeToolsVisible : true,  
		            	         ZoomToolsVisible : false,  
		            	         NavToolsVisible : false,  
		            	         CursorToolsVisible : true,  
		            	         SearchToolsVisible : true,                          
		            	         localeChain: 'zh_CN'  
            	        	 }
            	         }
            		);
               	}
               	
            	
                //接收刷新事件
	            eventBusService.subscribe(controllerName, 'appPart.data.reload', function(event, data) {
	            	$scope.find();
	            });
	            
	            $scope.goBack = function() {
	            	window.history.back();  //返回上一页
	            }
	            
	            $scope.find();
            }
        ];
    });
}).call(this);
