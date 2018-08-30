package cn.smartercampus.core.web.data;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.util.HttpsPost;
import cn.smartercampus.core.util.HttpsUtil;
import cn.smartercampus.core.util.PropertiesUtil;
import cn.smartercampus.core.vo.ExceptionVo;
import cn.smartercampus.core.vo.ResultVo;
import cn.smartercampus.core.vo.UserVo;


public class UserData extends BaseData {
	
	private static final long serialVersionUID = 1L;
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	
	public void logout(){
		try {
			//token,openid
			 request.getSession().removeAttribute("userInfo");
			 request.getSession().removeAttribute("token");
			 request.getSession().removeAttribute("openid");
			 output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			output("9999","error");
		}
		 
	}
	public void GetMobileUser() {
		try {
			Logger logger = Logger.getLogger("Phone GetAccessToken");
			Object userIno = session.getAttribute("userInfo");
			if(userIno == null){
				Map<String, Object> map = getParameterMap();
				//mobile
				if(map.containsKey("codePk")) {
					map.put("sqlMapId", "findUnitPkByUserIDNumber");
					Object userInfo = openService.queryForObject(map);
					System.out.println(map);
					System.out.println("mobile userInfo:"+userInfo);
					if(userInfo != null) {
						session.setAttribute("userInfo", userInfo);
						request.getSession().setAttribute("userInfo", userInfo);
						System.out.println(session.getAttribute("userInfo").toString());
						System.out.println(request.getSession().getAttribute("userInfo").toString());
						response.sendRedirect("/TeacherEDUPhone/index.jsp");
					}
				}
			}else {
				response.sendRedirect("/TeacherEDUPhone/index.jsp");
			}
		}catch (Exception e) {
			e.printStackTrace();
			output("9999"," Exception ",e);
		}
	}
	
	public void GetAccessToken() {
		try {
			Logger logger = Logger.getLogger("Phone GetAccessToken");
			Object userIno = session.getAttribute("userInfo");
			if(userIno == null){
				Map<String, Object> map = getParameterMap();
				//mobile
				if(map.containsKey("codePk")) {
					map.put("sqlMapId", "findUnitPkByUserIDNumber");
					Object userInfo = openService.queryForObject(map);
					System.out.println("mobile userInfo:"+userInfo);
					if(userInfo != null) {
						request.getSession().setAttribute("userInfo", userInfo);
						response.sendRedirect("/index.jsp");
					}
				}
			}
		}catch (Exception e) {
			e.printStackTrace();
			output("9999"," Exception ",e);
		}
	}
	
	
	 
	public void getUserInfo(){
		try {
			Object obj = request.getSession().getAttribute("userInfo");
			System.out.println("getUserInfo:"+obj);
			if(null != obj) {
				try {
					UserVo userVo = (UserVo)obj;
					if(null == userVo.getFK_UNIT()) {
						Map<String, Object> map = getParameterMap();
						map.put("sqlMapId", "findUnitPkByUserPk");
						Object userInfo = openService.queryForObject(map);
						if(userInfo != null) {
							request.getSession().setAttribute("userInfo", userInfo);
							obj = userInfo;
						}else {
							output("4004","此用户不存在！");
						}
					}
				} catch (Exception e) {
					// TODO: handle exception
				}
				
				output(obj);
				
				
			}
			
		}catch (Exception e) {
			e.printStackTrace();
			output("9999"," Exception ",e);
		}
	}
	
	/**
	 * 获取资源目录结构
	 */
	public void getSubjectBypid(){
		try {
			List<Map<String, Object>> newList = new ArrayList<Map<String,Object>>();
			Map<String, Object> map = getParameterMap();
			String treeid = map.get("G_PID").toString();
			map.put("sqlMapId", "getSubjectSortbypid");
			List<Map<String, Object>> list = openService.queryForList(map);
			if(list.size()==1){
				Map<String, Object> subjectMap = list.get(0);
			    treeid = subjectMap.get("G_ID").toString();
			    map.put("G_PID", treeid);
			    List<Map<String, Object>> secendlist = openService.queryForList(map);
			    newList = secendlist;
			    subjectMap.put("open", true);
			    newList.add(subjectMap);
			}else{
				newList = list;
			}
			
			output(newList);	
			
		} catch (ExceptionVo e) {
			e.printStackTrace();
			output(e.getCode(),e.getMsg());
		} catch (Exception e) {
			e.printStackTrace();
			output("9999"," Exception ",e);
		}
	}
	
}
