package cn.smartercampus.core.web.data;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;

import org.apache.http.HttpEntity;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import cn.smartercampus.core.service.OpenService;
import cn.smartercampus.core.util.PropertiesUtil;
import cn.smartercampus.core.util.QRCode;
import cn.smartercampus.core.util.SIGN;
import cn.smartercampus.core.util.SessionUtil;
import cn.smartercampus.core.vo.ExceptionVo;

public class QrcodeData extends BaseData
{

private static final long serialVersionUID = 1L;
	
	
	private OpenService openService;
	

	public OpenService getOpenService() {
		return openService;
	}

	public void setOpenService(OpenService openService) {
		this.openService = openService;
	}


	/**
	 * 输出微信扫描的二维码
	 */
//	public void qrcode(){
//		try {
//			
//				BufferedImage image = QRCode.genBarcode("https://passport.sjedu.cn/oAuth/connect/qrcode?redirect_qrcode="+redirect_qrcode,300, 300);  
//				response.setContentType("image/png");  
//				response.setHeader("pragma", "no-cache");
//				response.setHeader("cache-control", "no-cache");
//				response.reset();
//				ImageIO.write(image, "png", response.getOutputStream());
//
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
	
	/**
	 * 输出微信扫描的二维码
	 */
	public void qrcode(){
		try {
			if(null != request.getParameter("redirect_qrcode")){
				String url = PropertiesUtil.get("Auth-wx-qrcode-url");
				url = url.replace("STATE", request.getParameter("course_pk"));
				System.out.println("qrcodeURL:"+url);
				//url = url.replace("COURSE_PK", request.getParameter("course_pk"));
				response.sendRedirect(url);
			}else{
				String redirect_qrcode = session.getId();
				HttpSession webSession = SessionUtil.getSession(redirect_qrcode);
				if(null == webSession){
					SessionUtil.addSession(session);
				}
				Map<String, Object> map = getParameterMap();
				
				System.out.println("qrcodeMap:"+map);
				
				BufferedImage image = QRCode.genBarcode("http://hygl.pdedu.sh.cn/TeacherEDUPhone/json/Qrcode_qrcode.json?redirect_qrcode="+redirect_qrcode+"&course_pk="+map.get("COURSE_PK"),200, 200);  
				response.setContentType("image/png");  
				response.setHeader("pragma", "no-cache");
				response.setHeader("cache-control", "no-cache");
				response.reset();
				ImageIO.write(image, "png", response.getOutputStream());
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 微信扫码签到
	 * 
	 */
	public void qrauth(){
		try {
			System.out.println("Phone--------------------------------");
			
			String code = request.getParameter("code");
			if(null != code && !"".equals(code)){
				String openId = getOpenIdByCode(code);
				System.out.println("WeChart openId : "+openId);
				
				String state = request.getParameter("state");
				System.out.println("WeChart COURSE : "+state);
				
				Map<String, Object> map = getParameterMap();
				map.put("openid", openId);
				map.put("course_pk", state);
				map.put("sqlMapId", "checkUserWx");
				
				Object userInfo = openService.queryForObject(map);
				Map<String,Object> userMap = (Map<String, Object>) openService.queryForObject(map);
				System.out.println(userInfo);
				
				//如果用户存在并且已绑定微信
				if(userInfo != null) {
					//检查该课程是否已经签到
					map.put("FK_TEACHER", userMap.get("GUID").toString());
					map.put("FK_COURSE", state);
					map.put("sqlMapId", "checkIsQrCode");
					List<Map<String,Object>> check = openService.queryForList(map);
					if(check.size() == 0) {
						map.put("sqlMapId", "ScCourseTeacherQrcodeInsert");
						String uuid = openService.insert(map);
						System.out.println(userMap.get("ID_NUMBER").toString() + "签到" + state + "|=|" + uuid);
					}
					System.out.println(userMap.get("ID_NUMBER").toString() + "签到" + state + "|=|" + "check");
					
					String strBackUrl = "http://" + request.getServerName() //服务器地址  
                    + ":"   
                    + request.getServerPort()           //端口号  
                    + request.getContextPath()      //项目名称  
                    + request.getServletPath()      //请求页面或其他地址  
                + "?" + (request.getQueryString()); //参数 
					
					System.out.println(strBackUrl);
					String strBackUrlJsp = "http://hygl.pdedu.sh.cn/TeacherEDUPhone/qrcode_success.jsp/";
					map.put("sqlMapId", "getNewTicket");
					Map<String, Object> ticketMap = (Map<String, Object>) openService.queryForObject(map);
					//Map<String, String> signMap = SIGN.sign(ticketMap.get("TICKET").toString(),strBackUrl);
					Map<String, String> signMap = SIGN.sign(ticketMap.get("TICKET").toString(),strBackUrlJsp);
					
					String params = "";
					for (Map.Entry entry : signMap.entrySet()) {
						params = entry.getKey() + "=" + entry.getValue() + "&" + params;
			            //System.out.println(entry.getKey() + ", " + entry.getValue());
			        }
					params = params.substring(0, params.length()-1);
					//String webUrl = "http://hygl.pdedu.sh.cn/TeacherEDUPhone/qrcode_success.jsp?"+params;
					String webUrl = "http://hygl.pdedu.sh.cn/TeacherEDUPhone/qrcode_success.jsp?"+"userPk="+map.get("FK_TEACHER").toString()+"&coursePk="+map.get("FK_COURSE").toString();
					System.out.println("webUrl = " + webUrl);
					System.out.println("-----------------------");
					response.sendRedirect(webUrl);
				}else {
					//如果用户没绑定微信，跳转到登陆页
					request.getSession().removeAttribute("userInfo");
					session.removeAttribute("userInfo");
					request.getSession().setAttribute("openid", map.get("openid").toString());
					session.setAttribute("openid", map.get("openid").toString());
					response.sendRedirect("http://hygl.pdedu.sh.cn/api/GetAccessToken?openid="+openId);
				}
				}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	/**
	 * 校验用户经纬度
	 */
	public void checkLngLat() {
		try {
			Map<String, Object> map = getParameterMap();
			System.out.println("checkLngLat"+map);
			
			//查找会议地点经纬度
			map.put("sqlMapId", "getCourseLatLng");
			Map<String, Object> courseMap = (Map<String, Object>) openService.queryForObject(map);
			System.out.println("courseMap:"+courseMap);
			
			
			//会议地点与用户地点经纬度比较
			boolean flag = checkLatLng(map.get("Lat").toString(),map.get("Lng").toString(),courseMap.get("LAT").toString(),courseMap.get("LNG").toString());
			if(flag) {
				System.out.println("自动识别经纬度成功！");
				map.put("state", "2");
				map.put("sqlMapId", "updateUserCouseState");
				boolean qdFlag = openService.update(map);
				System.out.println("签到"+qdFlag);
			}else {
				System.out.println("自动识别经纬度失败！");
				map.put("state", "0");
			}
			
			map.put("sqlMapId", "updateUserCourseStat");
			boolean updateFlag = openService.update(map);
			System.out.println("update--course"+map.get("coursePk").toString()+"--teacherPk"+ map.get("userPk").toString()+"--flag is " + updateFlag);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public boolean checkLatLng(String userLat,String userLng,String unitLat,String unitLng) {
		System.out.println("checkLatLng: "+userLat+","+userLng+","+unitLat+","+unitLng);
		//比较lat
		String userLatStr [] = userLat.split("\\.");
		String unitLatStr [] = unitLat.split("\\.");
		if(userLatStr[0].equals(unitLatStr[0])) {
			String userStr [] = userLatStr[1].split("");
			String unitStr [] = unitLatStr[1].split("");
			if(userStr[0].equals(unitStr[0]) && userStr[1].equals(unitStr[1])) {
				System.out.println("lat is ok");
			}else {
				return false;
			}
		}else {
			return false;
		}
		
		//比较lng
		String userLngStr [] = userLng.split("\\.");
		String unitLngStr [] = unitLng.split("\\.");
		if(userLngStr[0].equals(unitLngStr[0])) {
			String userStr [] = userLngStr[1].split("");
			String unitStr [] = unitLngStr[1].split("");
			if(userStr[0].equals(unitStr[0]) && userStr[1].equals(unitStr[1])) {
				System.out.println("lngis ok");
				return true;
			}else {
				return false;
			}
		}
		
		return false;
	}
	
	/**
	 * 获取wx接口签名
	 */
	public void getWxInfo() {
		try {
			Map<String, Object> map = getParameterMap();
			
			map.put("sqlMapId", "getNewTicket");
			Map<String, Object> ticketMap = (Map<String, Object>) openService.queryForObject(map);
			String url = map.get("url").toString();
			url = URLDecoder.decode(url);
			System.out.println("url:"+url);
			Map<String, String> signMap = SIGN.sign(ticketMap.get("TICKET").toString(),url);
		
			output(signMap);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private void forward(String pagePath){
		try {
			request.getRequestDispatcher(pagePath).forward(request, response);
		} catch (Exception e) {
		}
	}
	
	@SuppressWarnings("rawtypes")
	public String get(String url) {  
        CloseableHttpClient httpclient = HttpClients.createDefault();  
        try {  
            // 创建httpget.    
            HttpGet httpget = new HttpGet(url);  
            System.out.println("executing request " + httpget.getURI());  
            // 执行get请求.    
            CloseableHttpResponse response = httpclient.execute(httpget);  
            try {  
                // 获取响应实体    
                HttpEntity entity = response.getEntity();  
                System.out.println("--------------------------------------");  
                // 打印响应状态    
                System.out.println(response.getStatusLine());  
                if (entity != null) {  
                    // 打印响应内容长度    
                    System.out.println("Response content length: " + entity.getContentLength());  
                    // 打印响应内容    
                    
                    String content = EntityUtils.toString(entity);
                    
                    System.out.println("Response content: " + content);  
                    
                    try {
						Map map = toMap(content);
						return map.get("openid").toString();
					} catch (JSONException e) {
						e.printStackTrace();
					}
                    
                }  
                System.out.println("------------------------------------");  
                return null;
            } finally {  
                response.close();  
            }  
        } catch (ClientProtocolException e) {  
            e.printStackTrace();  
        } catch (ParseException e) {  
            e.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        } finally {  
            // 关闭连接,释放资源    
            try {  
                httpclient.close();  
            } catch (IOException e) {  
                e.printStackTrace();  
            }  
        }
		return null;  
    }  
	
	/**
     * 将Json对象转换成Map
     * 
     * @param jsonObject
     *            json对象
     * @return Map对象
     * @throws JSONException
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
	public Map toMap(String jsonString) throws JSONException {

        JSONObject jsonObject = new JSONObject(jsonString);
        
        Map result = new HashMap();
        Iterator iterator = jsonObject.keys();
        String key = null;
        String value = null;
        
        while (iterator.hasNext()) {

            key = (String) iterator.next();
            value = jsonObject.getString(key);
            result.put(key, value);

        }
        return result;

    }
	
	public String getOpenIdByCode(String code){
		String url = PropertiesUtil.get("WX_GET_OPENID_URL");
		url = url.replace("CODE", code);
		System.out.println("getOpenIdByCode="+url);
		String openId=get(url);
		System.out.println(openId);
		return openId;
	}
}
