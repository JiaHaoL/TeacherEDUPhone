package cn.smartercampus.core.web.data;

import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.vo.PageVo;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class VoteData extends BaseData {

	private static final long serialVersionUID = 1L;
	private OpenService openService;
	private Logger logger=Logger.getLogger(this.getClass());

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}
	
	//查询投票结果
	public void findVoteResultList() {
		try {
			Map<String, Object> map = getParameterMap();
			
			PageVo page = readPage();
			map.put("page", page);
			
			map.put("sqlMapId", "findVoteResultList");
			List<Map<String, Object>> mapList = openService.queryForList(map);
			
			output("0000", mapList, page);
		} catch (Exception e) {
			output("9999", "exception", e);
			logger.info(e);
		}
	}
	
	//投票结果插入
	public void gainVoteCountUpdate() {
		try {
			Map<String, Object> map = getParameterMap();
			map.put("userInfo", request.getSession().getAttribute("userInfo"));
			//JSONObject userInfo = JSONObject.fromObject(map.get("userInfo"));

			Object obj = request.getSession().getAttribute("userInfo");
			Map<String, Object> userInfo = (Map<String, Object>)obj;
			
			//将问卷id提交到答案列表中	
			map.put("FK_USER", userInfo.get("GUID"));
			map.put("SURVEY_SUBJECTTEACHER_ID","SUBJECTTEACHER4180A1127B7A681E0");
			map.put("sqlMapId", "AnswerInsert");
			String answerPk = openService.insert(map);
			
			map.put("sqlMapId", "VoteResultInsert");
			map.put("SURVEY_ANSWER_ID",answerPk);
			JSONArray dataArray = JSONArray.fromObject(map.get("FK_OPTION_LIST"));
			for (int i = 0; i < dataArray.size(); i++) {
				map.put("SURVEY_CONTENT_ID", dataArray.get(i).toString());
				openService.insert(map);
			}
			
			//更新填写份数
			map.put("sqlMapId", "UpdateWriteNumber");
			openService.update(map);
			
			output("0000", "success");
		} catch (Exception e) {
			// TODO: handle exception
			output("9999","exception",e);
			logger.error(e);
		}
	}
	
	//查询扩展信息
	public void findExpandInfoById() {
		try {
			Map<String, Object> map=getParameterMap();
			
			map.put("sqlMapId", "findExpandInfoByOptionId");
			Object obj = openService.queryForObject(map);
			if(obj == null) {
				output("0000", "");
			}else{
				output("0000", obj);
			}
		} catch (Exception e) {
			// TODO: handle exception
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
	//添加扩展信息
	public void addExpandInfo() {
		try {
			Map<String, Object> map=getParameterMap();
			
			
			map.put("sqlMapId", "ExpandInformationInsert");
			String pk = openService.insert(map);
			
			output("0000", pk);
		} catch (Exception e) {
			// TODO: handle exception
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
	//更新评选人员扩展信息
	public void updateExpandInfo() {
		try {
			Map<String, Object> map=getParameterMap();

			map.put("sqlMapId", "ExpandInformationUpdate");
			openService.update(map);
			
			output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			output("9999", "exception",e);
		    logger.error(e,e);
		}
	}
	
}
