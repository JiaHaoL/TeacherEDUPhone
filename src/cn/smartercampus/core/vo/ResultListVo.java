package cn.smartercampus.core.vo;

import java.util.List;

public class ResultListVo {
	private String id;                                      //提交答案时获取的问卷ID
	private List<QuestionnaireResultVo> results;            //提交答案
	private List<UpdatetitleOrder> titleid;                 //修改时获取的题目id
	private String teacherId;								//任课教师ID  SURVEY_SUBJECTTEACHER_ID
	private String answerUserId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<QuestionnaireResultVo> getResults() {
		return results;
	}

	public void setResults(List<QuestionnaireResultVo> results) {
		this.results = results;
	}

	public List<UpdatetitleOrder> getTitleid() {
		return titleid;
	}

	public void setTitleid(List<UpdatetitleOrder> titleid) {
		this.titleid = titleid;
	}

	public String getTeacherId() {
		return teacherId;
	}

	public void setTeacherId(String teacherId) {
		this.teacherId = teacherId;
	}

	public String getAnswerUserId() {
		return answerUserId;
	}

	public void setAnswerUserId(String answerUserId) {
		this.answerUserId = answerUserId;
	}

	
	
	
}
