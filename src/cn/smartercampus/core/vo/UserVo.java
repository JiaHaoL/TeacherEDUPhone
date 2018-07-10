package cn.smartercampus.core.vo;

public class UserVo extends BaseVo {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String PersonalID;
	private int UserType = 0;
	private String UserName;
	private String LoginAcc;
	private String GUID;
	private String FK_UNIT;
	
	
	public String getFK_UNIT() {
		return FK_UNIT;
	}
	public void setFK_UNIT(String fK_UNIT) {
		FK_UNIT = fK_UNIT;
	}
	public String getGUID() {
		return GUID;
	}
	public void setGUID(String gUID) {
		GUID = gUID;
	}
	public String getPersonalID() {
		return PersonalID;
	}
	public void setPersonalID(String personalID) {
		PersonalID = personalID;
		GUID = personalID;
	}
	public int getUserType() {
		return UserType;
	}
	public void setUserType(int userType) {
		UserType = userType;
	}
	public String getUserName() {
		return UserName;
	}
	public void setUserName(String userName) {
		UserName = userName;
	}
	public String getLoginAcc() {
		return LoginAcc;
	}
	public void setLoginAcc(String loginAcc) {
		LoginAcc = loginAcc;
	}

	
	
}
