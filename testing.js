function callback(result){
    console.log(result);
    return result;
}
function shuffleRandom(n, callback){
    var ar = [];
    var temp;
    var rnum;
    for(var i=1; i<=n; i++){
        ar.push(i);
    }
    for(var i=0; i< ar.length ; i++){
        rnum = Math.floor(Math.random() *n);
        temp = ar[i];
        ar[i] = ar[rnum];
        ar[rnum] = temp;
    }
    callback(ar);
}
