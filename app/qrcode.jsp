<%@page import="cn.smartercampus.core.service.OpenService"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%
String path = request.getContextPath(); 
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 

System.out.println(request.getParameter("COURSE_PK"));
String course_pk = request.getParameter("COURSE_PK");
String user_pk = request.getParameter("user_pk");

Map<String,Object> map = new HashMap<String,Object>();
map.put("FK_COURSE",course_pk);
map.put("FK_TEACHER",user_pk);
map.put("sqlMapId", "ScCourseTeacherQrcodeInsert");

ApplicationContext ctx =   
WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());  
  
OpenService openService = (OpenService) ctx.getBean("openService");  
String uuid = openService.insert(map);

System.out.println("uuid="+uuid);


response.sendRedirect("qrcode_success.jsp");
%>

<html>
<head>
<meta charset="UTF-8">
<title>会议管理</title>
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
</head>
<body>

</body>
</html>