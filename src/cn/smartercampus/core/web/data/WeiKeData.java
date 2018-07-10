package cn.smartercampus.core.web.data;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;


public class WeiKeData extends BaseData {
	
	private static final long serialVersionUID = 1L;
	
	private Logger logger = Logger.getLogger(this.getClass());
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	public void shareWeiKe(){
		try {
			Map<String, Object> map = getParameterMap();
			map.put("NODE_PID", map.get("THEME_ID"));
			map.put("sqlMapId", "findResStudySubject");
			List<Map<String, Object>> mapList = openService.queryForList(map);
			String str ="";
			boolean flag = true;
			for(int i=0;i<mapList.size();i++){
				Map<String, Object> obj = mapList.get(i);
				map.put("SECTION_ID", obj.get("NODE_ID"));
				map.put("sqlMapId", "findWeiKe");
				List<Map<String, Object>> weikeList = openService.queryForList(map);
				if(weikeList.size()>0){
					 
				}else{
					flag = false;
					if("".equals(str)){
						str = obj.get("NODE_TEXT")+"章节下未添加微课;";
					}else{
						str = str+obj.get("NODE_TEXT")+"章节下未添加微课;";
					}
					
				}
			}
			if(flag==false){
				output("4444",str);
			}else{
				map.put("STATUS", 2);
				map.put("sqlMapId", "weikeForStatusUpdate");
				openService.update(map);
				output("0000","success");
			}
			
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e,e); 
			output("9999"," Exception ",e);
		}
	}
	
	
}
