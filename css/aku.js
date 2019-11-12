//var info = document.getElementById('info');
//window.onload = function(){
//    var pathname = location.pathname;
//    var id = pathname.split('/');
//    if(id[2] == 'login'){
//        var temp_span = document.createElement('span');
//        temp_span.innerHTML = "Check you Id or PW";
//        info.appendChild(temp_span);
//    }
//};
var click = true;
function noDouble(){
    if (click) {
          click = !click;
     } else {
          console.log("doubleclicked");
     }
}