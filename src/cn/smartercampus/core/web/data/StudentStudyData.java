package cn.smartercampus.core.web.data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.vo.ExceptionVo;


public class StudentStudyData extends BaseData {
	
	private static final long serialVersionUID = 1L;
	
	private Logger logger = Logger.getLogger(this.getClass());
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	//题目作答
	public void saveQuestionResult(){
		try {
			Map<String, Object> map = getParameterMap();
			if(map.get("USER_ANSWERS") !=null && "".equals(map.get("USER_ANSWERS").toString())){
				String questiontype = map.get("QUESTION_TYPE").toString();
				map.put("sqlMapId", "exerciseInsert");
				openService.insert(map);
				if("DANX".equals(questiontype) || "DUOX".equals(questiontype) || "TK".equals(questiontype)){
					 String right_answers = map.get("RIGHT_ANSWERS").toString();
					 String urser_answers = map.get("USER_ANSWERS").toString();
					 if(!right_answers.equals(urser_answers)){
						 map.put("sqlMapId", "findWrongQuestion");
						 List<Map<String, Object>> list = openService.queryForList(map);
						 if(list.size()==0){
							 map.put("STATUS", 0);
							 map.put("sqlMapId", "wrongQuestionInsert");
							 openService.insert(map);
						 }
						 
					 }
				}
			}		
			output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e,e); 
			output("9999"," Exception ",e);
		}
	}
	
	
	public void favoriteInsert(){
		try {
			Map<String, Object> map = getParameterMap();
			map.put("sqlMapId", "findFavoriteByUser");
			List<Map<String, Object>> list = openService.queryForList(map);
			if(list==null || list.size()==0){
				map.put("sqlMapId", "favoriteInsert");
				openService.insert(map);
			}
			output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e,e); 
			output("9999"," Exception ",e);
		}
	}
	
	
}
