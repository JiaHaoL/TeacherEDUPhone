package cn.smartercampus.core.util;


import java.io.BufferedReader;  
import java.io.IOException;  
import java.io.InputStreamReader;  
import java.net.MalformedURLException;  
import java.net.URL;  

import javax.net.ssl.HttpsURLConnection;  
import com.alibaba.fastjson.JSON;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import cn.smartercampus.core.vo.UserVo;

public class HttpsUtil extends HttpsPost {
	
	public static void main(String[] args) {
		
		try {
			heart("https://pd-ms-sso01.pdedu.sh.cn/AuthAPI/api/auth/GetUserInfo","","Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Imk3cWoxMF9qYmh1LTV5SWJ5ZEZWajRIUzhydyJ9.eyJhdWQiOiJodHRwOi8vYWRhdXRoL0F1dGgiLCJpc3MiOiJodHRwOi8vUEQtTVMtU1NPMDEucGRlZHUuc2guY24vYWRmcy9zZXJ2aWNlcy90cnVzdCIsImlhdCI6MTUyMDg1Mjc3OCwiZXhwIjoxNTIwODgxNTc4LCJ1bmlxdWVfbmFtZSI6IjMxMDExOTIwMDAxMDI3MjgyMkBwZGVkdS5zaC5jbiIsImNvbW1vbm5hbWUiOiLkuIHkvbPmlY8iLCJyb2xlIjoiRG9tYWluIFVzZXJzIiwiYXV0aF90aW1lIjoiMjAxOC0wMy0xMlQxMTowNjoxOC4yNjBaIiwiYXV0aG1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwidmVyIjoiMS4wIiwiYXBwaWQiOiIyMDE4aHlnbCJ9.IooZmWjU6b_pSW0lucRAh70c-DoRKoPkK__EHl8Kk0VWFLQhxmPsIVFuHd_GXYk2fnnkXExo8HDKUIahyjirXluaFhiXtx-gMKTCC7kwB3pf-hiTv0AWbQf47jGNCCwCppXUIFeUbZvL5z7uSsAk0MHF2fDM3kDOkFedwcXOXGfP92rkm-wzIUNcga_WE7EOG2sAhWloMxfvokja6LIOXj_bfLnSyfBO_fa3OsAWvtshiDsbFSqch9TLRxGk4vCTEpbtHWSXKNauF8q55DadWfQJqYDJXr0rxbqhyLRh2dejFeY_eoiCaRTpRKcDAn3EMJkIsILbgjMV8QrGP1Vy-A");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static UserVo heart(String httpsUrl, String xmlStr ,String Authorization) throws Exception{
        CloseableHttpClient httpClient=HttpClients.createDefault(); // 创建httpClient实例
        HttpGet httpGet=new HttpGet(httpsUrl); // 创建httpget实例
        httpGet.setHeader("Authorization", Authorization); // 设置请求头消息User-Agent
        CloseableHttpResponse response=httpClient.execute(httpGet); // 执行http get请求
        HttpEntity entity=response.getEntity(); // 获取返回实体
        String resultStr = EntityUtils.toString(entity, "utf-8");
        System.out.println("返回内容："+resultStr); // 获取网页内容
        response.close(); // response关闭
        httpClient.close(); // httpClient关闭  
        
        UserVo resultVo = JSON.parseObject(resultStr.toString(), UserVo.class);
        return resultVo;
    }

	   /** 
     * 发送请求. 
     * @param httpsUrl 
     *            请求的地址 
     * @param xmlStr 
     *            请求的数据 
     */  
    public static UserVo post(String httpsUrl, String xmlStr ,String Authorization) {  
        HttpsURLConnection urlCon = null;  
        try {  
            urlCon = (HttpsURLConnection) (new URL(httpsUrl)).openConnection();  
            urlCon.setDoInput(true);  
            urlCon.setDoOutput(true);  
            urlCon.setRequestMethod("GET");  
            urlCon.addRequestProperty("Content-Type", "application/json");
           
            urlCon.setUseCaches(false);  
            //urlCon.setRequestProperty("Authenticate", "Bearer");
            urlCon.setRequestProperty("Authorization", Authorization);

            System.out.println(Authorization);
            
            urlCon.getOutputStream().write(xmlStr.getBytes("UTF-8"));  
            urlCon.getOutputStream().flush();  
            //urlCon.getOutputStream().close();  
            BufferedReader in = new BufferedReader(new InputStreamReader(  
                    urlCon.getInputStream()));  
            String line; 
            StringBuffer resultStr = new StringBuffer();
            while ((line = in.readLine()) != null) {  
            	resultStr.append(line);  
            }  
            System.out.println(resultStr);
            UserVo resultVo = JSON.parseObject(resultStr.toString(), UserVo.class);
            return resultVo;
        } catch (MalformedURLException e) {  
            e.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        } catch (Exception e) {  
            e.printStackTrace();  
        }
		return null;  
    }  
	
}
