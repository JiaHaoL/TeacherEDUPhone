package cn.smartercampus.core.vo;

import java.util.List;

public class QuestionnaireResultVo extends BaseVo {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private List<String> resutId;         //提交答案时的选项id
	private String titleId;               //提交答案时的题目id
	private int titleType;                //题目类型
	private String titlechecked;          //提交答案时判断是否是必答题
	
	
	
	public String getTitlechecked() {
		return titlechecked;
	}
	public void setTitlechecked(String titlechecked) {
		this.titlechecked = titlechecked;
	}
	public int getTitleType() {
		return titleType;
	}
	public void setTitleType(int titleType) {
		this.titleType = titleType;
	}
	public List<String> getResutId() {
		return resutId;
	}
	public void setResutId(List<String> resutId) {
		this.resutId = resutId;
	}
	public String getTitleId() {
		return titleId;
	}
	public void setTitleId(String titleId) {
		this.titleId = titleId;
	}
	
	
}
