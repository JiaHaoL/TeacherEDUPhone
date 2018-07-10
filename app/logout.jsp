<%@page import="org.apache.log4j.Logger"%>
<%@page import="java.util.Map"%>
<%@page import="cn.smartercampus.core.util.HttpsPost"%>
<%@page import="cn.smartercampus.core.vo.ResultVo"%>
<%@page import="cn.smartercampus.core.util.PropertiesUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%

StringBuffer param = new StringBuffer(PropertiesUtil.get("APP_USER_AUTH_WEB_URL"));
StringBuffer redirect_uri = request.getRequestURL();

param.append("?redirect_uri=").append(java.net.URLEncoder.encode("http://hygl.pdedu.sh.cn/api/GetAccessToken","UTF-8"));
param.append("&resource=").append("http://adauth/Auth");
param.append("&client_id=").append(PropertiesUtil.get("APP_SSL_APPID"));
param.append("&response_type=").append("code");

session.invalidate();
response.sendRedirect(param.toString());

%>
