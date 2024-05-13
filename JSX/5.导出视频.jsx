var presetPath = "/Users/lidong/Desktop/EPR/my_preset_h264.epr";

function log(item){
	alert(item.toString());
}

function getAudioTrack(){
	var at = app.project.activeSequence.audioTracks[0];
	return at;
}

function getVideoTrack(){
	var vt = app.project.activeSequence.videoTracks[0];
	return vt;
}

function existAudioClip(){
	var audioTrack = getAudioTrack();
	if(audioTrack.clips.numItems == 0){
	   return false;
	}
	var audioClip = audioTrack.clips[0];
	if(audioClip == null){
		return fasle;
	}
	return true;
}

function existVideoClip(){
	var videoTrack = getVideoTrack();
    if(videoTrack.clips.numItems == 0){
	   return false;
	}
	var videoClip = videoTrack.clips[0];
	if(videoClip == null){
		return false;
	}
	return true;
}

//资源
function projectItem(){
	return app.project.rootItem.children[0]
}


function getOutpath(){
	var folderPath = $.getenv("outputFolder");
	if(folderPath == null){
	    // 获取文件夹路径
        var folder = Folder.selectDialog("请选择文件夹");
        if(folder == null){
           return null;
        }
        folderPath = folder.fsName;
        $.setenv("outputFolder",folderPath);
	}
	return folderPath;
}

function sequencesSetting(){
	//使用视频
	app.project.sequences[0].videoTracks[0].setMute(0);
	//静音
	app.project.sequences[0].audioTracks[0].setMute(1);
}


function checkEprExist(){
	var file = new File(presetPath);
	if (file.exists) {
    	return true;
	} else {
   		return false;
	}
}

function checkFileExist(path){
    var file = new File(path);
    if (file.exists) {
        return true;
    } else {
        return false;
    }
}


function getDataType(data) {
    return typeof data;
}

function getProjectColumnsMetadata(){
	var item = app.project.rootItem.children[0];
	var jsonString = item.getProjectColumnsMetadata();
	// 移除字符串两端的空格和换行符
    jsonString = jsonString.replace(/^\s+|\s+$/g, '');
    // 移除字符串中的换行符和制表符
    jsonString = jsonString.replace(/[\n\t\r]/g, ''); 
    // 移除字符串中的单引号
    jsonString = jsonString.replace(/'/g, '"');
    // 解析JSON字符串
    var jsonObject;
    try {
         // 使用ExtendScript的eval()函数解析JSON字符串
         array = eval('(' + jsonString + ')');
         // 遍历数组并输出每个元素
        for (var i = 0; i < array.length; i++) {
        	 log(array[i].ColumnName+" "+array[i].ColumnValue + " " + array[i].ColumnID);
         }
        
     } catch (e) {
         // 解析失败时处理异常
         log(e);
     }
}


function getFileSize(filePath) {
    var file = new File(filePath);
    file.open("r");
    var size = file.length;
    file.close();
    return size;
}

function getTime(){
	var time = app.project.rootItem.children[0].getOutPoint(1);
    return time.seconds; 
}

function getBitrate(){
	var path = app.project.rootItem.children[0].getMediaPath();
	var size = getFileSize(path);
    size = size / 1024 / 1024 ;
    var bitrate = Math.round(size*8/getTime());
    return bitrate;
}


function readEpr(){
	var inputFile = new File(presetPath);
	// Open the file in read mode
	if(inputFile.open("r")) {
        inputFile.encoding = "UTF-8"; 
   		 // Read the contents of the file
    	var fileContents = inputFile.read();
    	// Close the file
    	inputFile.close();
    	return fileContents;
    } else {
       // Alert if there's an error opening the file
       log("Error opening the Epr file.");
       return null
    }
}

function saveEpr(path,text){
    var file = new File(path);
	if(file.open("w")) {
         file.encoding = "UTF-8";
         var tempText = "";
         for(var i=0; i<text.length; i++){
            tempText = tempText + text[i];
            if( i>0 && i%100 == 0){
               file.write(tempText);
               tempText = "";
            }
         }
         if(tempText.length>0){
             file.write(tempText);
         }

    	 file.close();
    } else {
       // Alert if there's an error opening the file
       log("Error opening the Epr file.");
       return null
    }
}

function replaceText(input, searchText, replaceText) {
    return input.replace(new RegExp(searchText, 'g'), replaceText);
}

function getFolderPath(filePath){
	// Create a file object
	var file = new File(filePath);

	// Get the parent folder
	var parentFolder = file.parent;

	return parentFolder.fsName;
}

function join(folderPath, fileName) {
    // Check if folderPath ends with a path separator
    var separator = (folderPath.slice(-1) === "/" || folderPath.slice(-1) === "\\") ? "" : "/";
    // Concatenate folder path, separator, and file name
    return folderPath + separator + fileName;
}


function generateTempEpr(){
    var bitrate = getBitrate();
    var content = readEpr();
    if(content == null){
       return null;
    }
    var message = content;

    log("输出码率:"+bitrate.toString()+"M/s");

    message = replaceText(message,"117.379999999999995452526491",bitrate.toString());
    var folderPath = getFolderPath(presetPath);
    var tempPath = join(folderPath,"temp.epr");
    saveEpr(tempPath,message);
    return tempPath;
}

function startExport(outputFolder){
    //app.enableQE();

    var tempPath = generateTempEpr();
    if(tempPath == null){
       return;
    }

    if(!checkFileExist(tempPath)){
       log("temp epr不存在");
       return;
    }

    //var sequeue = qe.project.getActiveSequence();
    var sequeue = app.project.activeSequence;
    var name = projectItem().name;
    var outputPath = join(outputFolder,name);

    sequeue.exportAsMediaDirect(outputPath, tempPath, app.encoder.ENCODE_ENTIRE);
}



function main(){


    if(!checkEprExist()){
       log("epr文件不存在");
       return;
    }

	if(app.project.activeSequence == null){
	   log("队列不存在");
	   return;
	}

	if(existVideoClip() == false){
		log("视频不存在");
    	return;
	}

 	if(existAudioClip() == false){
		log("音频不存在");
		return;
	}

    var outputPath = getOutpath();
    if(outputPath == null){
       log("请设置输出文件夹路径"); 
       return;
    }

    if(app.project.sequences[0].videoTracks == null){
       log("视频不存在");
    	return;
    }

    if(app.project.sequences[0].audioTracks == null){
       log("音频不存在");
    	return;
    }

    
    sequencesSetting();

    startExport(outputPath);

	alert("执行完成");	

}


main();








