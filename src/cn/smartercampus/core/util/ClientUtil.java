package cn.smartercampus.core.util;

import java.util.ArrayList;
import java.util.List;
import org.apache.http.Header;
import org.apache.http.HeaderElement;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

public class ClientUtil {
	public String get(String url) {
		// 创建Http Client对象, 这就类似打来了一个浏览器并创建了一个浏览器进程
		HttpClient httpclient = new DefaultHttpClient();
		// 创建Get类型的Http请求对象
		HttpGet httpget = new HttpGet(url);
		// 设置报文头字段
		httpget.setHeader("Accept-Language", "zh,en;q=0.8,zh-CN;q=0.6");
		httpget.setHeader("User-Agent", "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36");
		httpget.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
		
		// 用于获取响应对象
		HttpResponse response = null;

		try {
		   httpget.setHeader(new Header() {
					
		      public String getValue() {
		          return "zh-cn";
		      }
					
		      public String getName() {
		          return "Accept-Language";
		      }
					
		      public HeaderElement[] getElements() throws ParseException {
		          return null;
		      }
		    });

		    response = httpclient.execute(httpget);
		    int responseStatusCode = response.getStatusLine().getStatusCode();
            //System.out.println("Response statusCode: " + responseStatusCode);  
            
		    // HTTP响应报文成功
		    if (responseStatusCode == 200) {
		        HttpEntity httpEntity = response.getEntity();
		        List resultInfoList = new ArrayList(); 
		        if (httpEntity != null) {
		        	 // 打印响应内容长度    
                    //System.out.println("Response content length: " + httpEntity.getContentLength());  
                    // 打印响应内容    
                    
                    String content = EntityUtils.toString(httpEntity);
                    
                    //System.out.println("Response content: " + content);  
                    
		            return content.trim();
		        }         	
		    } else {
		        System.out.println();
		        return "回应的HTTP报文状态值:" + responseStatusCode;
		    }
		} catch (Exception e) {
		    e.printStackTrace();
		}
	    return null;
		
	}
}
