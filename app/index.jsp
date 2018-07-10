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
	%>
	<script type="text/javascript">
		var url = "http://hygl.pdedu.sh.cn/?userinfo=0";
		window.location.href = url;
	</script>
	<%
}
%>
<%
	String path = request.getContextPath(); 
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 
%>

<!DOCTYPE html>
<html ng-app="app" lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	
    <title>会议管理系统</title>
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
  <body class="theme-blue"  style="padding:0px;background:#f1faff url('assets/img/left.png') top left repeat-y;">
    <div class="ng-view" ></div>
  </body>
  
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/jquery/1.11.3/jquery.min.js"></script>
  <script type="text/javascript" src="js/jquery.uploadify-v2.1.4/swfobject.js"></script>
  <script type="text/javascript" src="js/jquery.uploadify-v2.1.4/jquery.uploadify.v2.1.4.min.js"></script>
  
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/angular/1.2.0/angular.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/angular/1.2.0/angular-route.min.js"></script>
  <script type="text/javascript" src="http://hygl.pdedu.sh.cn/js/util.js"></script>
  <script type="text/javascript" src="config/app.js?v=5"></script>
  <script data-main="config/loader.js?v=5" src="http://hygl.pdedu.sh.cn/js/require/require.min.js"></script>
</html>