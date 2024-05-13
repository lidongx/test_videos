function log(item){
	alert(item.toString());
}

function getFileName(mediaPath){
    var lastSlashIndex = mediaPath.lastIndexOf("/");
    var fileName;
    if (lastSlashIndex !== -1) {
       fileName = mediaPath.substring(lastSlashIndex + 1);
    } else {
       fileName = mediaPath; // 如果没有斜杠，则文件名为路径本身
    }
    return fileName;
}


function main(){
	//注意这里保存的是字符串，默认是逗号分隔
	var fileStr = $.getenv("inputFiles");
	if(fileStr == null){
	   log("需重设置输入文件夹");
	   return;
	}
	var array = fileStr.split(",");
	if(array.length == 0){
	   log("设置输入文件夹没有视频,需重设置输入文件夹");
	   return;
	}

	if(array.length == 0){
    	log("上次打开的文件夹没有视频,需重新打开输入文件夹");
	}else{
		var index = $.getenv("fileIndex");
		index = parseInt(index);
		var len = array.length-1;
		index = index-1;
		if(index < 0){
	   		log("已经是文件夹下第一个视频了");
		}else{
	   		var path = array[index];
			app.project.rootItem.children[0].changeMediaPath(path);
			var fileName = getFileName(path);
    		app.project.rootItem.children[0].name = fileName;
			$.setenv("fileIndex", index);
			log("执行完成");
		}
	}
}

main();









