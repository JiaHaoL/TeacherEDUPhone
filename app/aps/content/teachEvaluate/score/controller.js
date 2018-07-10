(function() {
    define([], function() {
        return [
             '$scope','httpService','config','params', 'eventBusService','controllerName','loggingService', function($scope,$httpService,config,params, eventBusService,controllerName,loggingService) {
            	 loggingService.info(controllerName,"loaded");
            	 $httpService.css("assets/css/star.css");
            	 $scope.form ={};
            	 $scope.form.nowp = 0;
            	 $scope.form.COURSEPK = params.pk;
            	 $scope.form.SUBJECTPK = params.subjectpk;
            	
            	 /*尾页*/
            	 $scope.end = function(){
            		 $("#up").show();
            		 $("#next").hide();
            		 $("#sub").show();
            		 var nowp = $scope.form.nowp;
            		 var data = $scope.form.dataList;
            		 var leh = data.length;
            		 $scope.form.nowp = leh-1;
            		 title(data[leh-1].TEXTONE);
            		 $("#"+data[nowp].SC_ASSESS_PK).hide();
            		 $("#"+data[leh-1].SC_ASSESS_PK).show();
            		 $scope.nowPage = leh;
            		 $('html, body').animate({scrollTop:0}, 'fast');
            	 }
            	 /*首页*/
            	 $scope.begin = function(){
            		 //$("#up").hide();
            		 $("#next").show();
            		 $("#sub").hide();
            		 var nowp = $scope.form.nowp;
            		 $scope.form.nowp = 0;
            		 var data = $scope.form.dataList;
            		 title(data[0].TEXTONE);
            		 $("#"+data[nowp].SC_ASSESS_PK).hide();
            		 $("#"+data[0].SC_ASSESS_PK).show();
            		 $scope.nowPage = 1;
            		 $('html, body').animate({scrollTop:0}, 'fast');
            	 }
            	 /*上一页*/
            	 $scope.up = function(){
            		 if($scope.form.nowp == 0){
            			 return;
            		 }
            		 $("#next").show();
            		 var nowp = $scope.form.nowp;
            		 $scope.form.nowp = nowp-1;
            		 var data = $scope.form.dataList;
            		 var leh = data.length;
            		 if( $scope.form.nowp != leh-1){
            			 $("#sub").hide();
            		 }
            		 title(data[nowp-1].TEXTONE);
            		 $("#"+data[nowp].SC_ASSESS_PK).hide();
            		 $("#"+data[nowp-1].SC_ASSESS_PK).show();
            		 $scope.nowPage = $scope.form.nowp+1;
            		 $('html, body').animate({scrollTop:0}, 'fast');
            	 }
            	 /*下一页*/
            	 $scope.down = function(){
            		 $("#up").show();
            		 var nowp = $scope.form.nowp;
            		 $scope.form.nowp = nowp+1;
            		 var data = $scope.form.dataList;
            		 var leh = data.length;
            		 if($scope.form.nowp == leh-1){
            			 $("#next").hide();
            			 $("#sub").show();
            		 }
            		 if($scope.form.nowp != leh-1){
            			 $("#sub").hide();
            		 }
            		 title(data[nowp+1].TEXTONE);
            		 $("#"+data[nowp].SC_ASSESS_PK).hide();
            		 $("#"+data[nowp+1].SC_ASSESS_PK).show();
            		 $scope.nowPage = $scope.form.nowp+1;
            		 $('html, body').animate({scrollTop:0}, 'fast');
            		 //$scope.add(2);
            	 }
            	  /*用户手动输入*/
            	 $scope.userChange = function(key){
            		 var score = $("#"+key).val();
            		 
            		 if(score>5||score<0){
            			 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"分数为0-5分!"});
            			 $("#"+key).val("0");
            			 document.getElementById(key+0).checked = true;
            			 return;
            		 }
            		 if(score.length>3){
            			 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"最多只允许小数点后保留一位!"});
            			 $("#"+key).val("0");
            			 document.getElementById(key+0).checked = true;
            			 return;
            		 }
            		 if(parseInt(score).toString()== 'NaN'){
            			 eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"请输入正确格式的分数!"});
            			 $("#"+key).val("0");
            			 document.getElementById(key+0).checked = true;
            			 return;
            		 }
            		var scoreRound = Math.round(score); 
            		document.getElementById(key+scoreRound).checked = true;
            		$("#"+key+scoreRound).val(score);
            	 }
            	 /*点击星星事件*/
            	 $scope.scoreChange = function(key,value){
            		 $("#"+key).hide();
            		 $("#"+key).val(value);
            		 $("#"+key).show();
            	 }
            	 
            	 /*查询是否评价过*/
            	 var checkno = function(){
            		 $httpService.post(config.TeacherScoreCheckURL, $scope.form).success(function(data) {
               			if(data.code != '0000'){
                       		loggingService.info(data.msg);
                       	}else{
                       		$scope.form.checked = data.data[0].CHECKSCORE;
                       		init();
                          }
               			
                        }).error(function(data) {
                            loggingService.info('获取指标内容失败');
                        });	
            	 }
            	 
 
            	 /*给星星赋值*/
            	 var evalinit = function(obj){
            			 for(var i in obj){
                  			for(var j in obj[i].TEXTTWO){
                  				for(var k in obj[i].TEXTTWO[j].TEXTTHREE){
                  					var da = obj[i].TEXTTWO[j].TEXTTHREE[k].SC_ASSESS_PK;
                  					var score = obj[i].TEXTTWO[j].TEXTTHREE[k].SCORE;
                  					var dav = $('#'+controllerName+' input[name="'+da+'"]:checked').val();
                  					score = Math.round(score);
                  					if(da!= undefined){
                  						if($scope.form.checked == 0){
                  							document.getElementById(da+'0').checked = true;
                  							$("#"+da).val(0);
                  						}else{
                  							document.getElementById(da+score).checked = true;
                  						}
                  					}
                  				}
                  			}
                  			if(i!=0){
                  				$("#"+obj[i].SC_ASSESS_PK).hide();
                  				//$("#up").hide();
                  			}
                  		}
            			
            	 }
            	 /*返回按钮事件*/
            	 $scope.back = function() {           		 
                     var m2 = {
                     		"url":"aps/content/teachEvaluate/config.json",
         	                 "contentName":"content"
         	            }   
   	                eventBusService.publish(controllerName,'appPart.load.content.back', m2);
              	};
            	/*确定按钮事件*/
            	$scope.add = function(obj){
            		var ids = '';
            		var scores = '';
            		var url = '';
            		for(var i in $scope.dataList){
            			for(var j in $scope.dataList[i].TEXTTWO){
            				for(var k in $scope.dataList[i].TEXTTWO[j].TEXTTHREE){
            					var da = $scope.dataList[i].TEXTTWO[j].TEXTTHREE[k].SC_ASSESS_PK;
            					var dav = $('#'+controllerName+' input[name="'+da+'"]:checked').val();
            					if(dav != undefined){
            						ids = da+","+ids;
            						scores = dav+","+scores;
            					}else if(da != undefined){
            						ids = da+","+ids;
            						scores = 5+","+scores;
            					}
            				}
            			}	
            		}
            		$scope.form.ids = ids.substring(0,ids.length-1);
            		$scope.form.scores = scores.substring(0,scores.length-1);
            		if($scope.form.checked != 0){
           			 	 url = config.TeacherScoreUpdateURL;
	           		}else{
	           			 url = config.TeacherScoreInsertURL;
	           		  }
            		add(url,obj);
            	}
            	/* 新增*/
            	var add = function(url,obj){
            		$httpService.post(url, $scope.form).success(function(data) {
              			if(data.code != '0000'){
                      		loggingService.info(data.msg);
                      	}else{
                      		if(obj == 1){
                      		  eventBusService.publish(controllerName,'appPart.load.modal.alert', {"title":"操作提示","content":"评价成功!"});
   	                  		  $scope.back();
   	                  		  //$scope.$apply();
                      		}
                         }
              			
                       }).error(function(data) {
                           loggingService.info('评分失败');
                       });	
            	}
            	
            	var sub = function(){
            		$("#sub").hide();
            		
            	}
            	/*标题更改事件*/
            	var title = function(obj){
           		 var table = $("table");
           		 table[0].lastChild.children[0].childNodes[3].innerHTML = obj;
           		 //console.log(table[0].lastChild.children[0].childNodes[3].innerHTML);
           		 //var table = $("#res_admin_right_button").children("table");
           		 //table.prevObject[0].children[0].children[0].children[0].children[1].childNodes[0].nodeValue = obj;
        		 //console.log(table.prevObject[0].children[0].children[0].children[0].children[1].childNodes[0].nodeValue);
            	}
            	 var getData = function(url){
            		 $scope.form.FK_RULE="97233b073c49468eafc7852f61458fd0";
            		 $httpService.post(url, $scope.form).success(function(data) {
              			if(data.code != '0000'){
                      		loggingService.info(data.msg);
                      	}else{
                      		  $scope.dataList = data.data;
                      		  $scope.form.dataList = data.data;
                      		  $scope.pageNum= data.data.length;
                      		  $scope.nowPage = 1;
                      		  sub();
                      		  title(data.data[0].TEXTONE);
                      		  $scope.$apply();
                      		  evalinit(data.data);
                      		 
                         }
              			
                       }).error(function(data) {
                           loggingService.info('获取指标内容失败');
                       });	
            	 }
            	 
            	 /*初始化方法*/
            	 var init = function(){
            		 var url = '';
            		 if($scope.form.checked != '0'){
            			 url = config.TeacherScoreByIDURL;
            			 getData(url);
            			 
            		 }else{
            			 url = config.TeacherScoreAllListURL;
            			 getData(url);
            		 }
            	 }
            	
            	 checkno();
            	 
            }
        ];
    });
}).call(this);