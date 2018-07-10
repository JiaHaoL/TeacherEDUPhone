<%@page import="org.apache.log4j.Logger"%>
<%@page import="java.util.Map"%>
<%@page import="cn.smartercampus.core.util.HttpsPost"%>
<%@page import="cn.smartercampus.core.vo.ResultVo"%>
<%@page import="cn.smartercampus.core.util.PropertiesUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%
Logger logger = Logger.getLogger("index.jsp");

Object userIno = session.getAttribute("userInfo");
if(userIno == null){
	StringBuffer param = new StringBuffer(PropertiesUtil.get("APP_USER_AUTH_WEB_URL"));
	StringBuffer redirect_uri = request.getRequestURL();
	param.append("?redirect_uri=").append("REDIRECT_URI");
	param.append("&state=").append(session.getId());
	param.append("&appid=").append(PropertiesUtil.get("APP_SSL_APPID"));
	param.append("&scope=").append("mobile_login");
	
	String code = request.getParameter("code");
	if(code == null){
%>
<script type="text/javascript">
	var url = "<%=param %>";
	url = url.replace("REDIRECT_URI", encodeURIComponent(window.location.href.split('?')[0]));
	window.location.href = url;
</script>
		
<%
	}else{
        String httpsUrl = PropertiesUtil.get("APP_USER_AUTH_API_URL")+"accessToken"; 
        String xmlStr = "appid="+PropertiesUtil.get("APP_SSL_APPID")+"&secret="+PropertiesUtil.get("APP_SSL_APPSECRET")+"&grant_type=authorization_code&code="+code;  
        ResultVo result = HttpsPost.post(httpsUrl, xmlStr);  
        if(null == result){
        	%>
        	<script type="text/javascript">
        		alert("无权限获取用户信息，请联系应用中心管理员");
        		var url = "<%=param %>";
        		url = url.replace("REDIRECT_URI", encodeURIComponent(window.location.href.split('?')[0]));
        		window.location.href = url;
        	</script>
        			
        	<%
      	}else if("0000".endsWith(result.getCode())){
        	Map<?, ?> TokenVo = (Map<?, ?>) result.getData();
        	Object access_token = TokenVo.get("access_token");
        	Object openid = TokenVo.get("openid");
        	
        	session.setAttribute("token", access_token);
        	session.setAttribute("openid", openid);
        	logger.info("access_token : " + access_token);
        	
        	httpsUrl = PropertiesUtil.get("APP_USER_AUTH_API_URL")+"userInfo";  
	        xmlStr = "access_token="+access_token+"&openid="+openid;  
	        session.setAttribute("userInfo", HttpsPost.post(httpsUrl, xmlStr).getData());
        }else{
        	logger.info(result.getCode() + " : " + result.getMsg());
        	%>
        	<script type="text/javascript">
        		var url = "<%=param %>";
        		url = url.replace("REDIRECT_URI", encodeURIComponent(window.location.href.split('?')[0]));
        		window.location.href = url;
        	</script>
        			
        	<%
        }
		 
	}
}
%>

<%
	String path = request.getContextPath(); 
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 
%>

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	
    <title>研修培训</title>
    <base href="<%=basePath %>" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link href="http://hygl.pdedu.sh.cn/js/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
	<link href="assets/css/style.css" rel="stylesheet">
	
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="http://hygl.pdedu.sh.cn/js/html5/html5shiv.js"></script>
      <script src="http://hygl.pdedu.sh.cn/js/html5/respond.min.js"></script>
    <![endif]-->
    
    <!--[if lt IE 8]>
	<script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/json3/json3.min.js"></script>
	<![endif]-->
  </head>
  <body ng-app="app" >
    <div class="ng-view" >
    	<div style="text-align: center;margin-left: auto;margin-right: auto;margin-top: 120px;">
    	<img alt="" src="http://hygl.pdedu.sh.cn/img/loading_1.gif"><br/>
    	如果您等待时间过长，<a href="javascript:window.location.reload()" >请点击这里</a>
    	</div>
    </div>
  </body>
  <script type="text/javascript">
		function logout(){
			window.location.href="/StudentsStudyPhone/logout.jsp";
		}
  </script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/jquery/1.11.3/jquery.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/jqueryMobile/jquery.mobile-1.4.5.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/angular/1.2.0/angular.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/angular/1.2.0/angular-route.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/util.js"></script>
  <script data-main="config/loader.js?v=5" src="http://hygl.pdedu.sh.cn/js/require/require.min.js"></script>
  <script type="text/javascript" src="config/app.js"></script>
</html>