exports.finalHashtagMaker = function(hashtagString){
  var finalHashtag = [];
  var temp = [];
  while(hashtagString.indexOf(' ')>=0){
    hashtagString = hashtagString.replace(' ', "");
  }
  var temp = hashtagString.split('#');
  for(var i =0; i<temp.length; i++){
    if(temp[i] != ""){
      finalHashtag.push(temp[i]);
    }
  }
  return finalHashtag;
}

exports.isEmptyObject = function(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

exports.doubleChecker = function(a, b){
  var temp1 = [];
  var temp2 = [];
  if(a.length >= b.length){
    temp1 = b;
    temp2 = a;
  }
  else{
    temp1 = a;
    temp2 = b;
  }
  for(var i =0; i<temp1.length;i++){
    for(var j = 0; j<temp2.length;j++){
      if(temp1[i].id == temp2[j].id){
        temp2.splice(j, 1);
      }
    }
  }
  temp1 = temp1.concat(temp2);
  return temp1;
};

exports.searchStringLengthChecker = function(cari_string){
  var tempArray = cari_string.split(' ');
  var temp = [];
  for(var i=0; i<tempArray.length; i++){
    if(tempArray[i] !== ''){
      temp.push(tempArray[i]);
    }
  }
  return temp;
};

exports.remove_duplicates = function(objectsArray){
  var usedObjects = {};
  for(var i=objectsArray.length - 1;i>=0;i--){
    var so = JSON.stringify(objectsArray[i]);
    if(usedObjects[so]){
      objectsArray.splice(i, 1);
    }else{
      usedObjects[so] = true;
    }
  }
  return objectsArray;
};


var psqlMaker = function(pId){
    var tempArray = [];
    for(var l =0; l<pId.length;l++){
        if(tempArray.indexOf(pId[l]) < 0){
            tempArray.push(pId[l]);
        }
    }
    var temp = 'select * from penobrol where ';
    for(var j = 0; j<tempArray.length; j++){
        temp = temp + 'id = '+tempArray[j] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};
var tsqlMaker = function(tId){
    var tempArray = [];
    for(var l =0; l<tId.length;l++){
        if(tempArray.indexOf(tId[l]) < 0){
            tempArray.push(tId[l]);
        }
    }
    var temp = 'select * from tandya where ';
    for(var k = 0; k<tempArray.length; k++){
        temp = temp + 'id = '+tempArray[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};



var phtsqlMaker = function(hastagObject){
    var holength = hastagObject.length;
    var hotemp = [];
    for(var i =0; i<holength;i++){
        hotemp.push(hastagObject[i].id);
    }
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<hotemp.length; k++){
        temp = temp + 'p_id = '+hotemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var thtsqlMaker = function(hashtagObject){
    var holength = hashtagObject.length;
    var hotemp = [];
    for(var i =0; i<holength;i++){
        hotemp.push(hashtagObject[i].id);
    }
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<hotemp.length; k++){
        temp = temp + 't_id = '+hotemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};


var hsSearchSqlMaker = function(hashtags){
    var temp = "select * from hashtag AS result WHERE MATCH(hash) AGAINST('";
    for(var k = 0; k<hashtags.length; k++){
        temp = temp + hashtags[k] + ' ';
    }
    temp = temp.slice(0,-1);
    temp = temp+"')";
    return temp;
};

function codeMaker(){
    var ar = [];
    var final_code = '';
    var temp;
    var rnum;
    for(var j=1; j<=9; j++){ar.push(j);}
    for(var i=0; i< ar.length ; i++)
    {
        rnum = Math.floor(Math.random() *9); //난수발생
        temp = String(ar[i]);
        ar[i] = String(ar[rnum]);
        ar[rnum] = temp;
    }
    final_code = ar[0]+ar[1]+ar[2]+ar[3]+ar[4]+ar[5];
    return final_code;
}


var htsqlMaker = function(dateOrder, scoreOrder){
    var dlength = dateOrder.length;
    var slength = scoreOrder.length;
    var dtemp = [];
    var stemp = [];
    for(var i =0; i<dlength;i++){
        dtemp.push(dateOrder[i].id);
    }
    for(var j =0; j<slength;j++){
        stemp.push(scoreOrder[j].id);
    }
    dtemp = dtemp.concat(stemp);
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<dtemp.length; k++){
        temp = temp + 'p_id = '+dtemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var insertHashtagSqlMaker = function(p_id, hashArray){
    var temp = 'insert into hashtag (p_id, hash) values ';
    for(var i = 0; i<hashArray.length; i++){
        temp = temp + '('+p_id+", '"+hashArray[i]+"'), ";
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var htsqlMaker = function(dateOrder, scoreOrder){
    var dlength = dateOrder.length;
    var slength = scoreOrder.length;
    var dtemp = [];
    var stemp = [];
    for(var i =0; i<dlength;i++){
        dtemp.push(dateOrder[i].id);
    }
    for(var j =0; j<slength;j++){
        stemp.push(scoreOrder[j].id);
    }
    dtemp = dtemp.concat(stemp);
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<dtemp.length; k++){
        temp = temp + 't_id = '+dtemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var insertHashtagSqlMaker = function(t_id, hashArray){
    console.log(hashArray);
    var temp = 'insert into hashtag (t_id, hash) values ';
    for(var i = 0; i<hashArray.length; i++){
        temp = temp + '('+t_id+", '"+hashArray[i]+"'), ";
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    console.log(temp);
    return temp;
};
