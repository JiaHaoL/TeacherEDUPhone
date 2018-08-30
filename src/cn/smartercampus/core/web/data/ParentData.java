package cn.smartercampus.core.web.data;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.alibaba.fastjson.JSON;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.util.PropertiesUtil;
import cn.smartercampus.core.vo.PageVo;
import cn.smartercampus.core.vo.UserVo;

public class ParentData extends BaseData {
	private Logger logger = Logger.getLogger(this.getClass());
	
	
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}

	//查询登录用户角色
	public void findUserRoleCode() {
		HttpServletRequest request = ServletActionContext.getRequest();
		
		try {
			Map<String, Object> map = getParameterMap();
			map.put("userInfo", request.getSession().getAttribute("userInfo"));
			
			Object obj = request.getSession().getAttribute("userInfo");
			Map<String, Object> contentMap = (Map<String, Object>)obj;
			//JSONObject userInfo = JSONObject.fromObject(map.get("userInfo"));

			map.put("sqlMapId", "findRoleListByUserId");
			map.put("FK_USER", contentMap.get("GUID").toString());
			
			List<Map<String, Object>> mapList = openService.queryForList(map);
			String roleCode = "";
			if(mapList != null) {
				for (int i = 0; i < mapList.size(); i++) {
				    HashMap<String, Object> hm = (HashMap<String, Object>) mapList.get(i);
					if(hm.get("FK_ROLE").equals(PropertiesUtil.get("ADMIN_ROLE"))) {
						roleCode = "0";//数据采集－发布问卷调查
						break;
					}
					if(hm.get("FK_ROLE").equals("70fc0bae386741dd87aa1376cbb9073c") 
							|| hm.get("FK_ROLE").equals("b70289b0b5f74ea49860e5352df80f5c")) {
						roleCode = "1";//网络管理员-教导主任
					}
				}
			}
			output("0000", roleCode);
			
		} catch (Exception e) {
			// TODO: handle exception
			output("9999"," Exception ",e);
			logger.error(e, e);
		}
	}
	
    public void updateParent(){
    	try {
    		Map<String, Object> map = getParameterMap();
    		map.put("USER_EMAIL", map.get("USER_EMAIL").toString().toLowerCase());
    		map.put("sqlMapId", "parentUserEmailUpdate");
    		openService.update(map);
    		map.put("sqlMapId", "parentUpdate");
    		openService.update(map);
    		output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			output("9999"," Exception ",e);
			logger.error(e, e);
		}
    	  
    }
	
}
