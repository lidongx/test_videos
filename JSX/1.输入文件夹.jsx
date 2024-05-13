function log(item){
	alert(item.toString());
}

// 检查文件是否是视频文件
function isVideoFile(file) {
    var videoExtensions = [".mp4", ".mov", ".avi", ".mkv"]; // 视频文件扩展名列表
    var fileName = file.name.toLowerCase();
    for (var j = 0; j < videoExtensions.length; j++) {
        if (fileName.indexOf(videoExtensions[j]) !== -1) {
            return true;
        }
    }
    return false;
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
   // 获取文件夹路径
    var folderPath = Folder.selectDialog("请选择文件夹");
    if(folderPath == null){
       log("未选择文件夹");
       return;
    }

    var array = [];
    // 获取文件夹中的所有文件
    var files = folderPath.getFiles();
    // 遍历文件列表并输出视频文件路径
    for (var i = 0; i < files.length; i++) {
        if (files[i] instanceof File && isVideoFile(files[i])) {
            array.push(files[i].fsName);
        }
    }

    if(array.length == 0){
       log("文件夹下没有视频");
       return;
    }

    //保存全局变量
    $.setenv("inputFiles", array);
    $.setenv("fileIndex", -1);

    if(app.project.rootItem.children.length==0){
        var suppressWarnings     = true;
        var importAsStills      = false;
        var importThese = [];
        importThese.push(array[0]);
        app.project.importFiles(importThese,
                                            suppressWarnings,
                                            app.project.getInsertionBin(),
                                            importAsStills);
    }else{
        if(!app.project.rootItem.children[0].canChangeMediaPath()){
           log("模版不支持替换视频");
           return;
        }
        app.project.rootItem.children[0].changeMediaPath(array[0]);
        var fileName = getFileName(array[0]);
        app.project.rootItem.children[0].name = fileName;
    }
    $.setenv("fileIndex", 0);
    log("设置完成 "+folderPath.fsName);
}

main();







