package cn.smartercampus.core.web.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.vo.ExceptionVo;


public class ResStudySubjectData extends BaseData {
	
	private static final long serialVersionUID = 1L;
	
	private Logger logger = Logger.getLogger(this.getClass());
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	//得到两个层级的数据
	public void findSubject(){
		try {
			 Map<String, Object> map = getParameterMap();
			 map.put("sqlMapId", "findResBaseSubject");
			 List<Map<String, Object>> mapList = openService.queryForList(map);
			 Map<String, Object> dataMap = new HashMap<String, Object>();
			 for(int i=0;i<mapList.size();i++){
				 Map<String, Object> obj = mapList.get(i);
				 dataMap.clear();
				 dataMap.put("NODE_PID", obj.get("NODE_ID"));
				 dataMap.put("sqlMapId", "findResBaseSubject");
				 List<Map<String, Object>> subList = openService.queryForList(dataMap);
				 mapList.get(i).put("sublist", subList);
			 }
			 output(mapList);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e,e); 
			output("9999"," Exception ",e);
		}
		
	}
	
	//得到两个层级的数据
		public void findStudyTree(){
			try {
				 Map<String, Object> map = getParameterMap();
				 map.put("sqlMapId", "findStudyTreeChapter");
				 map.put("NODE_PROJECT", "0");
				 List<Map<String, Object>> mapList = openService.queryForList(map);
				 Map<String, Object> dataMap = new HashMap<String, Object>();
				 for(int i=0;i<mapList.size();i++){
					 Map<String, Object> obj = mapList.get(i);
					 dataMap.clear();
					 dataMap.put("NODE_PID", obj.get("NODE_ID"));
					 map.put("NODE_PROJECT", "0");
					 dataMap.put("sqlMapId", "findStudyTreeChapter");
					 List<Map<String, Object>> subList = openService.queryForList(dataMap);
					 mapList.get(i).put("sublist", subList);
				 }
				 output(mapList);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				logger.error(e,e); 
				output("9999"," Exception ",e);
			}
			
		}
}
