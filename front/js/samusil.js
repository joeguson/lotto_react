setInterval(AjaxFiveSec, 1000);
let countsec = 5;
function AjaxFiveSec(){
    if(countsec === 0){
        countsec=5;
        makeRequest('get','/api/samusil', null).then((res)=>{
             res = JSON.parse(res);
             document.getElementById("users").innerText = ("count user : "+ res.users);
             document.getElementById("penobrol").innerText = ("count penobrol : "+ res.penobrol);
             document.getElementById("tandya").innerText = ("count tandya : "+ res.tandya);
             document.getElementById("youtublog").innerText = ("count youtublog : "+ res.youtublog);
             document.getElementById("comment").innerText = ("count comment : "+ res.comment);
             document.getElementById("answer").innerText = ("count answer : "+ res.answer);
        });
    }
    countsec -= 1;
}
