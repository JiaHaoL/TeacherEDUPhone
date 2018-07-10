package cn.smartercampus.core.web.data;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.util.ClientUtil;
import cn.smartercampus.core.util.PropertiesUtil;

public class WxData extends BaseData {

	private static final long serialVersionUID = 1L;

	private OpenService openService;

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}

	/**
	 * 我的会议redirct_uri 
	 * 2018.4.27 
	 * Ljh
	 */
	public void myMeet() {
		Logger logger = Logger.getLogger("myMeet");
		try {
			// 获取code
			String code = request.getParameter("code");
			System.out.println(code);
			if (code != null) {
				String url = PropertiesUtil.get("WX_GET_OPENID_URL");
				url = url.replace("CODE", code);
				// 获取openid
				String result = new ClientUtil().get(url);
				Map<String, Object> map = (Map<String, Object>) JSON.parse(result);
				Map<String, Object> reqMap = new HashMap<String, Object>();
				if (map.containsKey("openid")) {
					reqMap.put("sqlMapId", "checkUserWx");
					reqMap.put("openid", map.get("openid").toString());
					Object userInfo = openService.queryForObject(reqMap);
					System.out.println(userInfo);
					//如果用户存在并且已绑定微信
					if(userInfo != null) {
						request.getSession().setAttribute("userInfo", userInfo);
						response.sendRedirect("/index.jsp");
					}else {
						//如果用户没绑定微信，跳转到登陆页
						request.getSession().removeAttribute("userInfo");
						request.getSession().setAttribute("openid", map.get("openid").toString());
						response.sendRedirect("http://hygl.pdedu.sh.cn/");
					}
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
