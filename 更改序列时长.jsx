
function log(item){
	alert(item.toString());
}



//资源
function projectItem(){
	return app.project.rootItem.children[0]
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


function main(){

    if(app.project.activeSequence == null){
       log("队列不存在");
       return;
    }


    if(existVideoClip() == false){
        log("视频不存在");
        return;
    }
    

    var sequence = app.project.activeSequence;
    var time = app.project.rootItem.children[0].getOutPoint(1);

    

    log("更新序列时长"+time.seconds.toString());

    
    var clip = app.project.activeSequence.videoTracks[0].clips[0];
    if(clip != null){
       clip.end = time.seconds;
       clip.start = 0;
    }

    clip = app.project.activeSequence.videoTracks[1].clips[0];
    if(clip != null){
       clip.end = time.seconds;
       clip.start = 0;
    }

    clip = app.project.activeSequence.videoTracks[2].clips[0];
    if(clip != null){
       clip.end = time.seconds;
       clip.start = 0;
    }

    clip = app.project.activeSequence.audioTracks[0].clips[0];
    if(clip != null){
       clip.end = time.seconds;
       clip.start = 0;
    }
    

    log("执行完成");

}


main();








