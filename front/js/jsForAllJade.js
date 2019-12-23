function datemaker(date){
  var tempdate = new Date(date);
  var nowdate = new Date();
  var year = tempdate.getFullYear();
  var year = tempdate.getFullYear();
  var month = tempdate.getMonth();
  var day = tempdate.getDate();
  var diff = nowdate - tempdate;
  if(diff > 864000000){
    return month+'-'+day;
  }
  else{
    if(diff > 86400000){
      return parseInt(diff/86400000)+' days ago';
    }
    else{
      if(diff > 3600000){
        return parseInt(diff/3600000)+' h ago';
      }
      else{
        if(diff > 60000){
          return parseInt(diff/60000)+' min ago';
        }
        else{
          return parseInt(diff/1000)+' sec ago';
        }
      }
    }
  }
}

function anonimmaker (username){
  var idChanger = '';
  var idLength = (username).length;
  idChanger = username.substr(0,3) + '****';
  return idChanger;
}

function commentLikeChecker(likeObject, cId, userId){
  for(var i = 0; i<likeObject.length; i++){
    if(likeObject[i].pc_id == cId && likeObject[i].u_id == userId){
      return true;
    }
  }
  return false;
}

function phashtagfinder(pid, hashtags){
  var temp = [];
  for(var i=0; i<hashtags.length; i++){
    if(hashtags[i].p_id == pid){
      temp.push(hashtags[i].hash);
    }
  }
  return temp;
}

function thashtagfinder (tid, hashtags){
  var temp = [];
  for(var i=0; i<hashtags.length; i++){
    if(hashtags[i].t_id == tid){
      temp.push(hashtags[i].hash);
    }
  }
  return temp;
}
function hashtagmaker(hashtagObject){
  var hashtag_temp = '';
  for(var i = 0; i<hashtagObject.length; i++){
    hashtag_temp= hashtag_temp + '#'+hashtagObject[i]+' ';
  }
  return hashtag_temp;
}
