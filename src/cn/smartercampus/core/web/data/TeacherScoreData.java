package cn.smartercampus.core.web.data;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.smartercampus.core.service.OpenService;

public class TeacherScoreData extends BaseData{
	private static final long serialVersionUID = 1L;
	
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
	/**
	 * 查询一级指标内容
	 */
	public void TeacherAssessOneList(){
		try {
			Map<String, Object> map = getParameterMap();
			int check = check(map.get("SUBJECTPK"));
			Map<String, Object> selectMapOne = new HashMap<String, Object>();
			if(check > 0){
				selectMapOne.put("sqlMapId", "TeacherScoreListOne");
				selectMapOne.put("COURSEPK", map.get("SUBJECTPK"));
				}else{
					selectMapOne.put("sqlMapId", "TeacherScoreListOneT");
				}
			List<Map<String, Object>> oneList = openService.queryForList(selectMapOne);
			output("0000",oneList);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			output("9999","error");
		}
	}
	
	/**
	 * 更新评分
	 */
	public void TeacherScoreUpdate(){
		try {
			Map<String, Object> map = getParameterMap();
			String ids = map.get("ids").toString();
			String scores = map.get("scores").toString();
			String[] obj = ids.split(",");
			String[] score = scores.split(",");
			for(int i = 0;i < obj.length;i++){
				Map<String, Object> insertMap = new HashMap<String, Object>();
				insertMap.put("COURSEPK", map.get("COURSEPK"));
				insertMap.put("FK_SC_ASSESS", obj[i]);
				insertMap.put("SCORE", score[i]);
				insertMap.put("userInfo", map.get("userInfo"));
				insertMap.put("sqlMapId", "TeacherScoreUpdate");
				openService.insert(insertMap);
			}
			output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			output("9999","error");
		}
	}
	
	/**
	 * 确认评分
	 */
	public void TeacherScoreInsert(){
		try {
			Map<String, Object> map = getParameterMap();
			String ids = map.get("ids").toString();
			String scores = map.get("scores").toString();
			String[] obj = ids.split(",");
			String[] score = scores.split(",");
			for(int i = 0;i < obj.length;i++){
				Map<String, Object> insertMap = new HashMap<String, Object>();
				insertMap.put("COURSEPK", map.get("COURSEPK"));
				insertMap.put("FK_SC_ASSESS", obj[i]);
				insertMap.put("SCORE", score[i]);
				insertMap.put("userInfo", map.get("userInfo"));
				insertMap.put("sqlMapId", "TeacherScoreInsert");
				openService.insert(insertMap);
			}
			output("0000","success");
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			output("9999","error");
		}
	}
	
	/**
	 * 未评分列表
	 */
	public void TeacherScoreAllList(){
		try {
				Map<String, Object> map = getParameterMap();
				int check = check(map.get("SUBJECTPK"));
				Map<String, Object> selectMapOne = new HashMap<String, Object>();
				if(check > 0){
					selectMapOne.put("sqlMapId", "TeacherScoreListOne");
					selectMapOne.put("COURSEPK", map.get("SUBJECTPK"));
					}else{
						selectMapOne.put("sqlMapId", "TeacherScoreListOneT");
					}
				List<Map<String, Object>> oneList = openService.queryForList(selectMapOne);
				for(int i = 0;i < oneList.size();i++){
					Map<String, Object> selectMapTwo = new HashMap<String, Object>();
					selectMapTwo.put("sqlMapId", "TeacherScoreListTwo");
					selectMapTwo.put("FK_PARENT", oneList.get(i).get("SC_ASSESS_PK"));
					List<Map<String, Object>> twoList = openService.queryForList(selectMapTwo);
					oneList.get(i).put("TEXTTWO", twoList);
					for(int j = 0;j < twoList.size();j++){
						Map<String, Object> selectMapThree = new HashMap<String, Object>();
						selectMapThree.put("sqlMapId", "TeacherScoreListThree");
						selectMapThree.put("FK_PARENT", twoList.get(j).get("SC_ASSESS_PK"));
						List<Map<String, Object>> threeList = openService.queryForList(selectMapThree);
						twoList.get(j).put("TEXTTHREE", threeList);
					}
				}
			output("0000",oneList);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			output("9999","error");
		}
	}
	/**
	 * 已评分列表
	 */
	public void TeacherScoreByID(){
		try {
			Map<String, Object> map = getParameterMap();
			int check = check(map.get("SUBJECTPK"));
			Map<String, Object> selectMapOne = new HashMap<String, Object>();
			if(check > 0){
				selectMapOne.put("sqlMapId", "TeacherScoreListOne");
				selectMapOne.put("COURSEPK", map.get("SUBJECTPK"));
				}else{
					selectMapOne.put("sqlMapId", "TeacherScoreListOneT");
				}
			List<Map<String, Object>> oneList = openService.queryForList(selectMapOne);
			for(int i = 0;i < oneList.size();i++){
				Map<String, Object> selectMapTwo = new HashMap<String, Object>();
				selectMapTwo.put("sqlMapId", "TeacherScoreListTwo");
				selectMapTwo.put("FK_PARENT", oneList.get(i).get("SC_ASSESS_PK"));
				List<Map<String, Object>> twoList = openService.queryForList(selectMapTwo);
				oneList.get(i).put("TEXTTWO", twoList);
				for(int j = 0;j < twoList.size();j++){
					Map<String, Object> selectMapThree = new HashMap<String, Object>();
					selectMapThree.put("sqlMapId", "TeacherScoreListThreeByID");
					selectMapThree.put("FK_COURSE", map.get("COURSEPK"));
					selectMapThree.put("userInfo", map.get("userInfo"));
					selectMapThree.put("FK_PARENT", twoList.get(j).get("SC_ASSESS_PK"));
					List<Map<String, Object>> threeList = openService.queryForList(selectMapThree);
					twoList.get(j).put("TEXTTHREE", threeList);
				}
			}
		output("0000",oneList);
	} catch (Exception e) {
		// TODO: handle exception
		e.printStackTrace();
		output("9999","error");
	}
	}
	
	/**
	 * 检验是否已评分
	 * @param object
	 * @return
	 */
	public int check(Object object){
		Map<String, Object> check = new HashMap<String, Object>();
		check.put("sqlMapId", "TeacherScoreListCheck");
		check.put("COURSEPK", object);
		List<Map<String, Object>> checkData;
		int checkres = 0;
		try {
			checkData = openService.queryForList(check);			 
			checkres = Integer.parseInt(checkData.toString().replace("[", "").replace("]", ""));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			output("9999","error");
		}
		return checkres;
	}
}
