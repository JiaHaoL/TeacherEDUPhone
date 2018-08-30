package cn.smartercampus.core.vo;

import java.util.List;

public class ContentresultVo {

	
	private String contentname;      //选项名称
	private String contentid;        //选项ID
	private int isDelete;            //获取要删除的选项id
	private String contentDef;       //获取选项是否已默认选中
	private String contentvalue;     //获取分数
	private String contentImg;       //图片
	
	private String imageWidth;	     //图片宽
	private String imageHeight;		 //图片高
	
	
	
	public String getContentImg() {
		return contentImg;
	}
	public void setContentImg(String contentImg) {
		this.contentImg = contentImg;
	}
	public String getContentvalue() {
		return contentvalue;
	}
	public void setContentvalue(String contentvalue) {
		this.contentvalue = contentvalue;
	}
	public String getContentDef() {
		return contentDef;
	}
	public void setContentDef(String contentDef) {
		this.contentDef = contentDef;
	}
	public int getIsDelete() {
		return isDelete;
	}
	public void setIsDelete(int isDelete) {
		this.isDelete = isDelete;
	}
	public String getContentname() {
		return contentname;
	}
	public void setContentname(String contentname) {
		this.contentname = contentname;
	}
	public String getContentid() {
		return contentid;
	}
	public void setContentid(String contentid) {
		this.contentid = contentid;
	}
	public String getImageWidth() {
		return imageWidth;
	}
	public void setImageWidth(String imageWidth) {
		this.imageWidth = imageWidth;
	}
	public String getImageHeight() {
		return imageHeight;
	}
	public void setImageHeight(String imageHeight) {
		this.imageHeight = imageHeight;
	}

    
	
	
}
