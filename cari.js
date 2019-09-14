var conn = require('./b-test');
exports.randomer = function(n){
        var ar = new Array();
        var temp;
        var rnum;
        //전달받은 매개변수 n만큼 배열 생성 ( 1~n )
        for(var i=1; i<=n; i++){
            ar.push(i);
        }
        //값을 서로 섞기
        for(var i=0; i< ar.length ; i++)
        {
            rnum = Math.floor(Math.random() *n); //난수발생
            temp = ar[i];
            ar[i] = ar[rnum];
            ar[rnum] = temp;
        }
        return ar;
};


