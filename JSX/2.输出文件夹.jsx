function log(item){
	alert(item.toString());
}

function getOutpath(){
	 // 获取文件夹路径
     var folder = Folder.selectDialog("请选择文件夹");
     if(folder == null){
         return null;
     }
     folderPath = folder.fsName;
     $.setenv("outputFolder",folderPath);
	 return folderPath;
}

function main(){
    var outputPath = getOutpath();
    if(outputPath == null){
       log("请设置输出文件夹路径"); 
       return;
    }
	log("设置完成 "+ outputPath);
}


main();
