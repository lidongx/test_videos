var presetPath = "/Users/lidong/Desktop/EPR/exportPNG.epr";


function log(item){
	alert(item.toString());
}

function getVideoTrack(){
	var vt = app.project.activeSequence.videoTracks[0];
	return vt;
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

function getPNGName(name){
    // Original video file name
    var videoFileName = name;

    // Find the last index of '.'
    var lastIndex = videoFileName.lastIndexOf(".");

    // Get the file name without extension
    var fileNameWithoutExtension = videoFileName.slice(0, lastIndex);

    // Replace the extension with '.png'
    var newFileName = fileNameWithoutExtension + ".png";

    return newFileName;
}

function generatePngName(name){
     // Original video file name
    var pngFileName = name;

    // Find the last index of '.'
    var lastIndex = pngFileName.lastIndexOf(".");

    // Get the file name without extension
    var fileNameWithoutExtension = pngFileName.slice(0, lastIndex);

    // Replace the extension with '.png'
    var newFileName = fileNameWithoutExtension + "0.png";

    return newFileName;
}



function getOutpath(){
     var folderPath = $.getenv("outputFrameFolder");
     if(folderPath == null){
         // 获取文件夹路径
        var folder = Folder.selectDialog("请选择导出帧文件夹");
        if(folder == null){
            return null;
        }
        folderPath = folder.fsName;
        $.setenv("outputFrameFolder",folderPath);
        return folderPath;
     }
     return folderPath;
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

function join(folderPath, fileName) {
    // Check if folderPath ends with a path separator
    var separator = (folderPath.slice(-1) === "/" || folderPath.slice(-1) === "\\") ? "" : "/";
    // Concatenate folder path, separator, and file name
    return folderPath + separator + fileName;
}

function rename(outputFolder,name){
    var generateName = generatePngName(name);
    var generatePath =  join(outputFolder,generateName);
    var generateFile = new File(generatePath);
    if(generateFile.exists){
       generateFile.rename(name);
    } 
}


function startExport(outputFolder){

    var pngEpr = presetPath;

    var sequeue = app.project.activeSequence;

    var currentTime = sequeue.getPlayerPosition();
    var oldInPoint  = sequeue.getInPointAsTime();
    var oldOutPoint = sequeue.getOutPointAsTime();
    var offsetTime  = currentTime.seconds + 0.033;  

    sequeue.setInPoint(currentTime.seconds);
    sequeue.setOutPoint(offsetTime);

    var name = projectItem().name;
    name = getPNGName(name);

    var outputPath = join(outputFolder,name);


    sequeue.exportAsMediaDirect(outputPath, pngEpr, app.encoder.ENCODE_IN_TO_OUT);

    rename(outputFolder,name);


    //还原
    sequeue.setInPoint(oldInPoint.seconds);
    sequeue.setOutPoint(oldOutPoint.seconds);

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


    var outputPath = getOutpath();
    if(outputPath == null){
       log("请设置输出帧文件夹路径"); 
       return;
    }



     startExport(outputPath);
   



	alert("执行完成");	

}


main();








