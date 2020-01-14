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

exports.extractWords = function(wordArray){
    var temp = '';
    for(var i = 0; i<wordArray.length; i++){
        console.log(wordArray[i].length);
        if(wordArray[i].length > 0){

            temp += wordArray[i];
        }
    }
}

exports.extractHash = function(wordArray){
    var temp = [];
    for(var i = 0; i<wordArray.length; i++){
        if(wordArray[i][0] == '#'){
            temp.push(wordArray[i])
        }
    }
    return temp;
}

exports.codeMaker = function(){
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

exports.pwMaker = function(){
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 15;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
    }
}

exports.generateFilename = function() {
    const d = new Date();
    var str = "";
    var str = d.getFullYear().toString() +
        (d.getMonth() + 1).toString() +
        d.getDate().toString() +
        d.getHours().toString() +
        d.getMinutes().toString() +
        d.getSeconds().toString() +
        Math.floor(Math.random() * 100000).toString();
    return str;
}

exports.getWordOnly = function(sentence){
    var temp = '';
    for (const ele of sentence) {
        if(ele.indexOf('#') < 0){
            temp += ele+' ';
        }
    }
    return temp;
}
exports.getHashOnly = function(sentence){
    var temp = [];
    for (const ele of sentence) {
        if(ele.indexOf('#') >= 0){
            temp.push(ele.slice(1));
        }
    }
    return temp;
}
