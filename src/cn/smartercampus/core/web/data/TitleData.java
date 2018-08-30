package cn.smartercampus.core.web.data;

import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.vo.ContentresultVo;
import cn.smartercampus.core.vo.QuestionnaireResultVo;
import cn.smartercampus.core.vo.ResultListVo;
import cn.smartercampus.core.vo.TitleVo;
import cn.smartercampus.core.vo.UpdatetitleOrder;
import net.sf.json.JSONObject;

public class TitleData extends BaseData {

	private static final long serialVersionUID = 1L;
	private OpenService openService;
	private Logger logger=Logger.getLogger(this.getClass());

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	//
	public void findTitleListById() {
		try {
			Map<String, Object> map = getParameterMap();
			
			map.put("sqlMapId", "findTitleListById");
			List<Map<String, Object>> mapList = openService.queryForList(map);
			
			for (int i = 0; i < mapList.size(); i++) {
				Map<String, Object> dataMap = mapList.get(i);
				map.put("sqlMapId", "findAnswerNumsById");
				map.put("SURVEY_TITLE_ID", dataMap.get("SURVEY_TITLE_ID"));
				dataMap.put("NUM", openService.queryForObject(map));
			}
			
			output("0000", mapList);
		} catch (Exception e) {
			output("9999", "exception", e);
			logger.info(e);
		}
	}
	
	//
	public void findOptionListById() {
		try {
			Map<String, Object> map = getParameterMap();
			
			map.put("sqlMapId", "findOptionListById");
			List<Map<String, Object>> mapList = openService.queryForList(map);
			
			for (int i = 0; i < mapList.size(); i++) {
				Map<String, Object> dataMap = mapList.get(i);
				map.put("sqlMapId", "findSynthNumsById");
				map.put("SURVEY_CONTENT_ID", dataMap.get("SURVEY_CONTENT_ID"));
				dataMap.put("NUMS", openService.queryForObject(map));
			}
			
			output("0000", mapList);
		} catch (Exception e) {
			output("9999", "exception", e);
			logger.info(e);
		}
	}
	
	//答案提交
	public void answerSubmit()
	{
		try {
			String pk = null;
			Map<String, Object> map=getParameterMap();
			Object object = read(ResultListVo.class);
			ResultListVo vo = (ResultListVo) object;
			//JSONObject userInfo = JSONObject.fromObject(session.getAttribute("userInfo"));
			
			Object objmy = request.getSession().getAttribute("userInfo");
			Map<String, Object> userInfo = (Map<String, Object>)objmy;
			
			//1.将问卷id提交到答案列表中	
			map.put("SURVEY_QUEST_ID", vo.getId());
			map.put("SURVEY_SUBJECTTEACHER_ID", vo.getTeacherId());
			map.put("FK_USER", userInfo.get("GUID"));
			map.put("sqlMapId", "AnswerInsert");
			pk= openService.insert(map);

			//2.将答案提交到答案表中				
			map.put("sqlMapId", "SynthInsert");
			List<QuestionnaireResultVo> list = vo.getResults();
			  
			for (int i = 0; i < list.size(); i++) {
				map.put("SURVEY_ANSWER_ID",pk);
				QuestionnaireResultVo obj = list.get(i);
				
				map.put("SURVEY_TITLE_ID", obj.getTitleId());
				List<String> resultList = obj.getResutId();	
			    for (int j = 0; j < resultList.size(); j++) { 			
					String[] ids = resultList.get(j).split(",");	
					
					for (int k = 0; k < ids.length; k++) {	
						if(ids.length == 2) {
							map.put("SURVEY_CONTENT_ID", ids[0]);
							map.put("SURVEY_VALUE", ids[1]);
							map.put("SURVEY_MATRIX_ID", null);
						}
						if(ids.length == 3){
							map.put("SURVEY_CONTENT_ID", ids[0]);
							map.put("SURVEY_MATRIX_ID", ids[1]);
							map.put("SURVEY_VALUE", ids[2]);
						}
					}		
					openService.insert(map);
			    }	
			} 
			
			map.put("sqlMapId", "UpdateWriteNumber");
			openService.update(map);
			
		    output("0000", "success");    
		} catch (Exception e) {
			// TODO Auto-generated catch block
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
	//选项，题目修改
	public void contentUpdate()
	{
		try {				
			Map<String, Object> map=getParameterMap();
			map.put("sqlMapId", "TitleUpdate");
			Object object1 = read(TitleVo.class);
			TitleVo vo2 = (TitleVo) object1;
			//修改题目
			map.put("SURVEY_TITLE_ID", vo2.getTitleid());
			map.put("SURVEY_TITLE_NAME", vo2.getTitlename());
			map.put("SURVEY_TITLE_TXT", vo2.getTitleTxt());
			map.put("MAXIMUN_VALUE", vo2.getTitleMaxValue());
			map.put("MINIMUN_VALUE", vo2.getTitleMinValue());
			if (vo2.getTitlechecked().equals("true")) {
				map.put("SURVEY_TITLE_QUE", "true");
			}else {
				map.put("SURVEY_TITLE_QUE", "false");
			}
			openService.update(map);//修改问卷题目
						
			//修改选项
			Object object = read(TitleVo.class);
			TitleVo vo = (TitleVo) object;	
			List<ContentresultVo> content=vo.getConten();
			
			for (int i = 0; i < content.size(); i++) {	
				//当选项不为空的时候，就进行修改
				if (content.get(i).getContentid()!=null) {
					if(content.get(i).getIsDelete() == 0) {
				        map.put("sqlMapId", "OptionUpdate");
					    map.put("SURVEY_CONTENT_ID", vo.getConten().get(i).getContentid());
					    map.put("SURVEY_QUEST_ORDER", i+1);//选项序号修改
						map.put("SURVEY_CONTENT_CHOOSE", vo.getConten().get(i).getContentname());
						map.put("SURVEY_CONTENT_VALUE", vo.getConten().get(i).getContentvalue());
						map.put("SURVEY_CONTENT_IMG", vo.getConten().get(i).getContentImg());
						map.put("IMAGE_WIDTH", vo.getConten().get(i).getImageWidth());
						map.put("IMAGE_HEIGHT", vo.getConten().get(i).getImageHeight());
						if (content.get(i).getContentDef().equals("true")) {								
					    	map.put("SURVEY_CONTENT_DEF", "1");    	
						}else {							
							map.put("SURVEY_CONTENT_DEF", "0");
						}
						openService.update(map);
					}else{
						//如果isDelete等于1 就删除选项
						map.put("SURVEY_CONTENT_ID", vo.getConten().get(i).getContentid());
						map.put("sqlMapId","deleteChoose");
						openService.delete(map);
					}
				 }else {
					 //当没有这个选项时，添加
				    map.put("sqlMapId","OptionInsert");
				    map.put("SURVEY_TITLE_ID", vo.getTitleid());
				    map.put("SURVEY_QUEST_ORDER", i+1);//选项序号增加
					map.put("SURVEY_CONTENT_CHOOSE", vo.getConten().get(i).getContentname());
					map.put("SURVEY_CONTENT_VALUE", vo.getConten().get(i).getContentvalue());
					map.put("SURVEY_CONTENT_IMG", vo.getConten().get(i).getContentImg());
					map.put("IMAGE_WIDTH", vo.getConten().get(i).getImageWidth());
					map.put("IMAGE_HEIGHT", vo.getConten().get(i).getImageHeight());
					openService.insert(map);
				 }   
			}
			output("0000", "success");  
		} catch (Exception e) {
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
	//题目、选项、行标题删除
	public void deleteTitle()
	{
		try {
			Map<String, Object> map=getParameterMap();
			String type = map.get("SURVEY_TYPE_ID").toString();
			//删除选项
			map.put("sqlMapId", "deleteTitleChoose");
			openService.delete(map);
			
			//删除行标题
			if(type.equals("10") || type.equals("11")) {
				map.put("sqlMapId", "deleteMatrixHeading");
				openService.delete(map);
			}
			
			//删除题目
			map.put("sqlMapId", "deleteTitle");
			openService.delete(map);
			output("0000", "success");  
		} catch (Exception e) {
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
	//题目序号修改
	public void updatetitleByid()
	{
		try {
			Map<String, Object> map=getParameterMap();
			map.put("sqlMapId", "updateTitleOrderById");//修改题目的排序		
			Object object=read(ResultListVo.class);
			ResultListVo vo=(ResultListVo) object;
			map.put("SURVEY_QUEST_ID", vo.getId());//先添加问卷的ID
			List<UpdatetitleOrder> orders=vo.getTitleid();
			for (int i = 0; i < orders.size(); i++) {	
				map.put("sqlMapId", "updateTitleOrderById");
				map.put("SURVEY_TITLE_ORDER", i+1);//根据返回的集合顺序，从而修改序号
				map.put("SURVEY_TITLE_ID", vo.getTitleid().get(i).getTitleId());	
				openService.update(map);				
			}	
			output("0000", "success"); 
		} catch (Exception e) {
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}

	//删除答案选项及答题用户
	public void deleteAnswer()
	{
		try {
			Map<String, Object> map=getParameterMap();
			map.put("sqlMapId", "deleteAnswer");//删除答案列表
			openService.delete(map);
			map.put("sqlMapId", "deleteSynth");//删除答案
			openService.delete(map);
			output("0000", "success");  
		} catch (Exception e) {
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
}
