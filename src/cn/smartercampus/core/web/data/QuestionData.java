package cn.smartercampus.core.web.data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.vo.ExceptionVo;
import cn.smartercampus.core.web.data.BaseData;


public class QuestionData extends BaseData {
	
	private static final long serialVersionUID = 1L;
	
	private Logger logger = Logger.getLogger(this.getClass());
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	public void getUserInfo(){
		output(request.getSession().getAttribute("userInfo"));
	}
	
	public void deleteQuestion(){
		try{
			 Map<String, Object> map = getParameterMap();
			 map.put("sqlMapId", "questionDelete");
			 openService.delete(map);
			 map.put("sqlMapId", "questionChooseDelete");
			 output("0000","sucess");
		 }catch(Exception e){
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e, e);
			output("9999"," Exception ",e);
		 }
	}
	
	
	public void findWrongQuestion(){
		 try{
			 Map<String, Object> map = getParameterMap();
			 map.put("sqlMapId", "findWrongQuestionList");
			 List<Map<String, Object>> questionList = openService.queryForList(map);
			 for(int i=0;i<questionList.size();i++){
				 Map<String, Object> obj = questionList.get(i);
				 if("DANX".equals(obj.get("QUESTION_TYPE")) || "DUOX".equals(obj.get("QUESTION_TYPE"))){
					 map.put("sqlMapId", "findQuestionChoose");
					 map.put("FK_QUESTION", obj.get("TK_QUESTION_PK"));
					 questionList.get(i).put("questionchoose", openService.queryForList(map));
				 }
			 }
			 output(questionList);
		 }catch(Exception e){
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e, e);
			output("9999"," Exception ",e);
		 }
	}
	
	
	public void findQuestion(){
		 try{
			 Map<String, Object> map = getParameterMap();
			 map.put("sqlMapId", "findQuestion");
			 List<Map<String, Object>> questionList = openService.queryForList(map);
			 for(int i=0;i<questionList.size();i++){
				 Map<String, Object> obj = questionList.get(i);
				 if("DANX".equals(obj.get("QUESTION_TYPE")) || "DUOX".equals(obj.get("QUESTION_TYPE"))){
					 map.put("sqlMapId", "findQuestionChoose");
					 map.put("FK_QUESTION", obj.get("TK_QUESTION_PK"));
					 questionList.get(i).put("questionchoose", openService.queryForList(map));
				 }
			 }
			 output(questionList);
		 }catch(Exception e){
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e, e);
			output("9999"," Exception ",e);
		 }
	}
	
	/**
	 * 新增习题
	 */
	public void insertQuestion(){
		 try {
			 checkTimeOut();
			 Map<String, Object> map = getParameterMap();
			 Map<String, Object> dataMap = new HashMap<String, Object>();
			 String paperid = "";
			 //验证是否已添加试卷
			 if(map.get("paperid")==null || "".equals(map.get("paperid"))){
				 dataMap.put("FK_STUDY_WEIKE", map.get("FK_STUDY_WEIKE"));
				 dataMap.put("sqlMapId", "findExamPaper");
				 List<Map<String, Object>> paperlist = openService.queryForList(dataMap);
				 if(paperlist.size()>0){
					 paperid =paperlist.get(0).get("STUDY_EXAM_PAPER_PK").toString();
				 }else{
					 dataMap.put("PAPER_TYPE", "XT");
					 dataMap.put("PAPER_DES", "习题练习");
					 dataMap.put("FK_STUDY_WEIKE", map.get("FK_STUDY_WEIKE")); 
					 dataMap.put("STATUS", 0);
					 dataMap.put("THEME_ID", map.get("THEME_ID"));
					 dataMap.put("sqlMapId", "ExamPaperInsert");
					 paperid = openService.insert(dataMap);
				 }
			 }else{
				 paperid = map.get("paperid").toString();
			 }
			 if("DANX".equals(map.get("QUESTION_TYPE")) || "DUOX".equals(map.get("QUESTION_TYPE"))){
				 //#ANSWER#,
				 map.put("STATUS", "0");
				 map.put("SOURSE", "YJXT");
				 map.put("KERNAL", "2");
				 map.put("QUESTION_LEVEL", "4");
				 map.put("REF_QUESTIONS", "0");
				 map.put("REF_EXAMS", "0");
				 map.put("FK_EXAM_PAPER", paperid);
				 map.put("sqlMapId", "questionInsert");
				 String questionid = openService.insert(map);				 
				 String choosesStr = map.get("ChooseList")+""; 
				 String ANSWER = "";
				 if(!"".equals(choosesStr)){
					    JSONArray jsonArray = JSONArray.fromObject(choosesStr);
						for(int i=0;i<jsonArray.size();i++){
							JSONObject obj = jsonArray.getJSONObject(i);
							dataMap.clear();
							dataMap.put("FK_QUESTION", questionid);
							dataMap.put("TEXT", obj.get("TEXT"));
							try {
								dataMap.put("ANALYSIS",obj.getString("ANALYSIS"));
							} catch (Exception e) {
								dataMap.put("ANALYSIS", null);
							}
							try {
								dataMap.put("PICURL",obj.getString("PICURL"));
							} catch (Exception e) {
								dataMap.put("PICURL", null);
							}
							try {
								dataMap.put("PICURL",obj.getString("PICURL"));
							} catch (Exception e) {
								dataMap.put("PICURL", null);
							}
							try {
                                if(Boolean.valueOf(obj.getString("isyes"))==true){
                                	dataMap.put("isyes","true");
                                }
							} catch (Exception e) {
								dataMap.put("isyes", "false");
							}
							
							dataMap.put("sqlMapId","questionChooseInsert");
							String chooseID = openService.insert(dataMap);
							if("true".equals(dataMap.get("isyes"))){
								ANSWER = ANSWER+","+chooseID;
							}
						}
						dataMap.clear();
						dataMap.put("ANSWER", ANSWER);
						dataMap.put("TK_QUESTION_PK", questionid);
						dataMap.put("sqlMapId", "questionForAnswerUpdate");
						openService.update(dataMap);
				 }
			 }else if(map.get("QUESTION_TYPE")=="TK"){
				 map.put("STATUS", "0");
				 map.put("SOURSE", "YJXT");
				 map.put("KERNAL", "2");
				 map.put("QUESTION_LEVEL", "4");
				 map.put("REF_QUESTIONS", "0");
				 map.put("REF_EXAMS", "0");
				 map.put("FK_EXAM_PAPER", paperid);
				 map.put("sqlMapId", "questionInsert");
				 String questionid = openService.insert(map);
			 }else{
				 map.put("STATUS", "0");
				 map.put("SOURSE", "YJXT");
				 map.put("KERNAL", "2");
				 map.put("QUESTION_LEVEL", "4");
				 map.put("REF_QUESTIONS", "0");
				 map.put("REF_EXAMS", "0");
				 map.put("FK_EXAM_PAPER", paperid);
				 map.put("sqlMapId", "questionInsert");
				 String questionid = openService.insert(map);
			 }
			 output(paperid);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			logger.error(e, e);
			output("9999"," Exception ",e);
		}
	}
	private void checkTimeOut() {
		Object userIno = session.getAttribute("userInfo");
		if(userIno == null){
			output("4006",session.getId()+" : 未登录或登录超时");
			return;
		}
	}
}
