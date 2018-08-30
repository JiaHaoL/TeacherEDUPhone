<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
String path = request.getContextPath(); 
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 
%>

<html>
<head>
<meta charset="UTF-8">
<title>会议管理扫码签到</title>
<base href="<%=basePath %>" />
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="keywords" content="SSO">
<meta http-equiv="description" content="SSO">
<meta http-equiv="content-type" content="text/html">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="renderer" content="webkit">
<meta http-equiv="X-UA-Compatible" content="IE=11; IE=9; IE=8">
<script type="text/javascript" src="http://hygl.pdedu.sh.cn/CDN/js/jquery/1.11.3/jquery.min.js"></script>
<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.4.6&key=042e114360bc65e3dabeb450bddab0f3"></script> 
<meta name="viewport" content="initial-scale=1.0, user-scalable=no"> 
<script type="text/javascript">
 
 </script>
</head>
<body style="background: rgb(50,53,66);">

   <div style="text-align: center;">
	      <img alt="" src="assets/img/qrcode_success.png"  style="margin-top: 70px;width:128px;height:128px;">
	      
	</div>
	
	<div style="margin-top: 50px;text-align: center;color: #fff;">
		<h4>签到失败！由于您已拒绝授权地理位置或不在会议地点，请等待组织教师确认</h4>
	</div>
	
</body>
</html>