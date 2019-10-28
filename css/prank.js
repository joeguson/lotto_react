//console.log('you are m');
//
//document.querySelector('.plikes').addEventListener('click', function(){
//  var v = parseInt(document.getElementById('plikes').innerHTML);
//  var pathname = location.pathname;
//  var id = pathname.split('/');
//  var original = v + 1;
//  sendAjax('/plikes/'+id[2], original);
//});
//function sendAjax(url, data){
//  var original2 = {'p_likes' : data};
//  original2 = JSON.stringify(original2);
//  var xhr = new XMLHttpRequest();
//  xhr.open('POST', url);
//  xhr.setRequestHeader('Content-type', "application/json");
//  xhr.send(original2);
//  // 데이터 수신이 완료되면 표시
//  xhr.addEventListener('load', function(){
//     console.log(xhr.responseText);
//     var result = JSON.parse(xhr.responseText);
//     if(result.result !== 'ok') return;
//     // 데이터가 있으면 결과값 표시
//     console.log(result);
//     document.getElementById("plikes").innerHTML = result.p_likes;
//  });
//}

function textScroll(scroll_el_id) {
    this.objElement = document.getElementById(scroll_el_id);
    this.objElement.style.position = 'relative';
    this.objElement.style.overflow = 'hidden';
    this.objLi = this.objElement.getElementsByTagName('dt');
    this.height = this.objElement.offsetHeight; // li 엘리먼트가 움직이는 높이(외부에서 변경가능)
    this.num = this.objLi.length; // li 엘리먼트의 총 갯수
    this.totalHeight = this.height*this.num; // 총 높이
    this.scrollspeed = 2; // 스크롤되는 px
    this.objTop = new Array(); // 각 li의 top 위치를 저장
    this.timer = null;
    
    for(var i=0; i<this.num; i++){
        this.objLi[i].style.position = 'absolute';
        this.objTop[i] = this.height*i;
        this.objLi[i].style.top = this.objTop[i]+"px";
    }
}

textScroll.prototype.move = function(){
    for(var i=0; i<this.num; i++) {
        this.objTop[i] = this.objTop[i] - this.scrollspeed;
        this.objLi[i].style.top = this.objTop[i]+"px";
    }
    if(this.objTop[0]%this.height == 0){
        this.jump();
    }else{
        clearTimeout(this.timer);
        this.timer = setTimeout(this.name+".move()",50);
    }
};

textScroll.prototype.jump = function(){
    for(var i=0; i<this.num; i++){
        if(this.objTop[i] == this.height*(-2)){
            this.objTop[i] = this.objTop[i] + this.totalHeight;
            this.objLi[i].style.top = this.objTop[i]+"px";
        }
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(this.name+".move()",3000);
};

textScroll.prototype.start = function() {
    this.timer = setTimeout(this.name+".move()",3000);
};
var real_search_keyword = new textScroll('precent2');
real_search_keyword.name = "real_search_keyword"; // 인스턴스 네임을 등록합니다
real_search_keyword.start(); // 스크롤링 시작
