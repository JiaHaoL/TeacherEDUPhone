package cn.smartercampus.core.web.data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.smartercampus.core.service.OpenService;

public class SheetGroupData extends BaseData {
	
	private static final long serialVersionUID = 1L;
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}

	public void updateSheetSubjectUser() {
		try {
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("sqlMapId", "getUserForSheetSubject");
			List<Map<String, Object>> list = openService.queryForList(map);
			for(int i=0;i<list.size();i++) {
				map.put("username", list.get(i).get("USERNAME").toString());
				map.put("fk_unit", list.get(i).get("FK_UNIT").toString());
				map.put("sqlMapId", "checkIsUserForUnit");
				List<Map<String, Object>> userList = openService.queryForList(map);
				if(userList.size()>1) {
					System.out.println("two user in unit:"+userList);
				}else if(userList.size() == 0){
					System.out.println("no user in unit:"+userList);
				}else {
					map.put("sqlMapId", "updateSheetSubjectUser");
					map.put("user_pk", userList.get(0).get("USER_PK").toString());
					openService.update(map);
				}
			}
			output("success");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 更新分组基础数据
	 */
	public void checkSynchroSubjectGroup() {
		try {
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("sqlMapId", "getDistinctUnitGroup");
			List<Map<String, Object>> groupList = openService.queryForList(map);
			for(int i=0;i<groupList.size();i++) {
				map.put("unitname", groupList.get(i).get("UNITNAME").toString());
				map.put("sqlMapId", "getUnitPKForShortName");
				List<Map<String, Object>> unitList = openService.queryForList(map);
				if(unitList.size() > 1) {
					System.out.println("short"+unitList);
				}else if(unitList.size() == 1){
					map.put("sqlMapId", "updateUnitPkForSubjectGroup");
					map.put("FK_UNIT", unitList.get(0).get("UNIT_PK").toString());
					openService.update(map);
				}else {
					map.put("sqlMapId", "getUnitPKForLongName");
					unitList = openService.queryForList(map);
					if(unitList.size() > 1) {
						System.out.println("long"+unitList);
					}else if(unitList.size() == 1){
						map.put("sqlMapId", "updateUnitPkForSubjectGroup");
						map.put("FK_UNIT", unitList.get(0).get("UNIT_PK").toString());
						openService.update(map);
					}else {
						System.out.println("no unit:"+groupList.get(i).get("UNITNAME").toString());
					}
				}
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * 学科带头人骨干教师分组设置
	 * SHEET_XKDTR_SUBJECT
	 */
	public void synchroSubjectGroup() {
		try {
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("sqlMapId", "getZzFromSheet");
			List<Map<String, Object>> zzList = openService.queryForList(map);
			for(int i=0;i<zzList.size();i++) {
				map.put("user_pk", zzList.get(i).get("FK_USER").toString());
				map.put("xkz", zzList.get(i).get("XKZ").toString());
				map.put("sqlMapId", "setUserGroupName");
				String groupId = openService.insert(map);
				map.put("groupId", groupId);
				map.put("sqlMapId", "setUserGroupNameUser");
				openService.insert(map);
			}
			output("success");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	
	
	
	
	
	
	
	
	
}
