package cn.smartercampus.core.vo;

import java.util.List;

public class TitleVo extends BaseVo {

	private static final long serialVersionUID = 1L;
	private String titleid;                     //修改时获取的题目id
	private String titlename;                   //修改时获取的题目名称
	private String titlechecked;                //获取题目是否为必答题
    private List<ContentresultVo> conten;       //选项
	
	private String titleMaxValue;				//题目最多可选数目
	private String titleMinValue;				//题目至少可选数目
	private String lineHeading;					//行标题
	private String matrixId;					//行标题id
	private String typeId;					    //题目类型id
	private String titleTxt;					//题目纯文本
	
	public String getTitlechecked() {
		return titlechecked;
	}
	public void setTitlechecked(String titlechecked) {
		this.titlechecked = titlechecked;
	}
	public String getTitleid() {
		return titleid;
	}
	public void setTitleid(String titleid) {
		this.titleid = titleid;
	}
	public String getTitlename() {
		return titlename;
	}
	public void setTitlename(String titlename) {
		this.titlename = titlename;
	}
	public List<ContentresultVo> getConten() {
		return conten;
	}
	public void setConten(List<ContentresultVo> conten) {
		this.conten = conten;
	}
	public String getTitleMaxValue() {
		return titleMaxValue;
	}
	public void setTitleMaxValue(String titleMaxValue) {
		this.titleMaxValue = titleMaxValue;
	}
	public String getTitleMinValue() {
		return titleMinValue;
	}
	public void setTitleMinValue(String titleMinValue) {
		this.titleMinValue = titleMinValue;
	}
	public String getLineHeading() {
		return lineHeading;
	}
	public void setLineHeading(String lineHeading) {
		this.lineHeading = lineHeading;
	}
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	public String getMatrixId() {
		return matrixId;
	}
	public void setMatrixId(String matrixId) {
		this.matrixId = matrixId;
	}
	public String getTitleTxt() {
		return titleTxt;
	}
	public void setTitleTxt(String titleTxt) {
		this.titleTxt = titleTxt;
	}
	
	
    	
}
