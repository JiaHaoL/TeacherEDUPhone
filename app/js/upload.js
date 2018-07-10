var UPLOAD = (function() {
	
    var iniUpload = function(uploadobj,uploadfiletype,uploadapp,openattr,userID,url,callonComplete){
    	
    	uploadobj.uploadify({
            'uploader': 'js/jquery.uploadify-v2.1.0/uploadify.swf',
            'script':url,
            'scriptData': {'uploadfiletype':uploadfiletype,uploadapp:uploadapp,'openattr':openattr,'UserID':userID},
            'cancelImg': 'js/jquery.uploadify-v2.1.0/cancel.png',
            //'buttonText': '上传文件',
            //'hideButton':true,
            'buttonImg':'assets/img/upload.png',
            'fileDataName':'fileload',
            'simUploadLimit' : 1,
            'queueSizeLimit' : 1,
            'auto':false,
            'multi': false,
            onComplete: callonComplete,
            onSelect:function(){
            },
            onError: function(event, queueID, fileObj) {
                alert("文件:" + fileObj.name + "上传失败");
            }
        });
    }
    
    return{
    	iniUpload:iniUpload  
    }; 
       
})();
