(function() {
	require.config({
		baseUrl : './',
		urlArgs: "v=5",
		paths : {
			jqueryUi : 'http://hygl.pdedu.sh.cn/CDN/js/jqueryUi/js/jquery-ui-1.9.2.custom.min',
			jqueryUiZh : 'http://hygl.pdedu.sh.cn/CDN/js/jqueryUi/jqueryUi_ZH',
			
			jztree : 'http://hygl.pdedu.sh.cn/CDN/js/zTree/js/jquery.ztree.all-3.5.min',
			smartMenu : 'http://hygl.pdedu.sh.cn/CDN/js/jquerySmartMenu/js/jquery-smartMenu-min',
			jqueryUpload : 'http://hygl.pdedu.sh.cn/CDN/js/jqueryUpload/jquery.upload',
			
			umeditorConfig : 'http://hygl.pdedu.sh.cn/CDN/js/umeditor/umeditor.config',
			umeditorMin : 'http://hygl.pdedu.sh.cn/CDN/js/umeditor/umeditor',
			umeditorLang : 'http://hygl.pdedu.sh.cn/CDN/js/umeditor/lang/zh-cn/zh-cn',
			
			jwplayer:"js/jwplayer/jwplayer",
	        flexpaper:"js/FlexPaper/flexpaper_flash",
	        wx:"http://res.wx.qq.com/open/js/jweixin-1.0.0",
	        videourl:"http://hygl.pdedu.sh.cn/CDN/js/util-video/video.util",
			
			highcharts: 'http://hygl.pdedu.sh.cn/CDN/js/highcharts/highcharts',
			highchartsMore: 'http://hygl.pdedu.sh.cn/CDN/js/highcharts/highcharts-more',
			highcharts3D: 'http://hygl.pdedu.sh.cn/CDN/js/highcharts/highcharts-3d',
			
			date: 'http://hygl.pdedu.sh.cn/CDN/js/bootstrap-daterangepicker/date',
			daterangepicker: 'http://hygl.pdedu.sh.cn/CDN/js/bootstrap-daterangepicker/daterangepicker',
			bootstrapDatetimepicker : 'http://hygl.pdedu.sh.cn/CDN/js/bootstrap-datetimepicker/js/bootstrap-datetimepicker',
			bootstrapDatetimepickerZhCn : 'http://hygl.pdedu.sh.cn/CDN/js/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
			
			pageController: 'http://hygl.pdedu.sh.cn/CDN/js/page',
			validateController: 'http://hygl.pdedu.sh.cn/CDN/js/validate'
		},
		shim : {
			highchartsMore : {
				deps : [ 'highcharts' ],
				exports : 'highchartsMore'
			},
			daterangepicker : {
				deps : [ 'date' ],
				exports : 'daterangepicker'
			},
			umeditorMin : {
				deps : [ 'umeditorConfig' ],
				exports : 'umeditorMin'
			},
			jqueryUiZh : {
				deps : [ 'jqueryUi'],
				exports : 'jqueryUiZh'
			},
			bootstrapDatetimepicker : {
				deps : [ 'jqueryUi'],
				exports : 'bootstrapDatetimepicker'
			},
			bootstrapDatetimepickerZhCn: {
				deps : [ 'bootstrapDatetimepicker'],
				exports : 'bootstrapDatetimepickerZhCn'
			},
			umeditorLang : {
				deps : [ 'umeditorMin' ],
				exports : 'umeditorLang'
			}
		}
		
	});
	

	require(['pageController','validateController'], function() {
		if(!window.console){
			console = (function(){
				var instance = null;
				function Constructor(){
					this.div = document.createElement("console");
					this.div.id = "console";
					this.div.style.cssText = "filter:alpha(opacity=80);position:absolute;top:100px;right:0px;width:30%;border:1px solid #ccc;background:#eee;display:none";
					document.body.appendChild(this.div);
					//this.div = document.getElementById("console");
				}
				Constructor.prototype = {
					log : function(str){
						var p = document.createElement("p");
						p.innerHTML = "LOG: "+str;
						this.div.appendChild(p);
					},
					debug : function(str){
						var p = document.createElement("p");
						p.innerHTML = "DEBUG: "+str;
						p.style.color = "blue";
						this.div.appendChild(p);
					},
					error : function(str){
						var p = document.createElement("p");
						p.innerHTML = "ERROR: "+str;
						p.style.color = "red";
						this.div.appendChild(p);
					}
				}
				function getInstance(){
					if(instance == null){
						instance =  new Constructor();
					}
					return instance;
				}
				return getInstance();
			})()
		}
	});
	
})(this);