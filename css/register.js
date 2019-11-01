var authenticator1 = '';
var authenticator2 = '';
var authenticator3 = '';
var sex = '';

document.getElementById('u_id').addEventListener('change', function(){
    var v = document.getElementById('u_id').value;
    if(v.length < 3){
        document.getElementById("idchecker").innerHTML = 'Terlalu pendek';
    }
    else if(data.indexOf(' ')>=0){
        document.getElementById("idchecker").innerHTML = 'tidak boleh / ada space bar';
        authenticator1 = '';
    }
    else{
        sendAjax('/aku/register', v);
    }
});
function sendAjax(url, data){
    var data2 = {'u_id' : data};
    data2 = JSON.stringify(data2);
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', "application/json");
  xhr.send(data2);
  // 데이터 수신이 완료되면 표시
  xhr.addEventListener('load', function(){
     var result = JSON.parse(xhr.responseText);
     if(result.result !== 'ok') return;
     // 데이터가 있으면 결과값 표시
      if(parseInt(result.u_id) > 0){
        document.getElementById("idchecker").innerHTML = 'tidak boleh';
          authenticator1 = '';
        }

      else{
        document.getElementById("idchecker").innerHTML = 'silakan';
          authenticator1 = '1';
      }
  });
}
document.getElementById('u_pw').addEventListener('change', function(){
    var v = document.getElementById('u_pw').value;
    if(v.length > 7){
        document.getElementById("pwchecker").innerHTML = 'perfect please repeat below';
        authenticator2 = '1';
    }
    else{
        document.getElementById("pwchecker").innerHTML = 'too short';
        authenticator2 = '';

    }
});
document.getElementById('u_pw2').addEventListener('change', function(){
    var v = document.getElementById('u_pw').value;
    var a = document.getElementById('u_pw2').value;
    if(v == a && v.length > 7){
        document.getElementById("pwchecker").innerHTML = 'perfect please proceed';
        authenticator3 = '1';
    }
    else{
        document.getElementById("pwchecker").innerHTML = 'pass word does not match';
        authenticator3 = '';
    }
});

document.getElementById('boy').addEventListener('click', function(){
    var laki = document.getElementById('boy');
    var perem = document.getElementById('girl');
    laki.style.backgroundColor = 'red';
    perem.style.backgroundColor = 'gray';
    sex = 'laki';
    var gender = document.getElementById('gender');
    gender.setAttribute('value', 'M');
});

document.getElementById('girl').addEventListener('click', function(){
    var laki = document.getElementById('boy');
    var perem = document.getElementById('girl');
    laki.style.backgroundColor = 'gray';
    perem.style.backgroundColor = 'red';
    sex = 'perempuan';
    var gender = document.getElementById('gender');
    gender.setAttribute('value', 'F');
});
document.getElementById('email').addEventListener('focus', function(){
    var authenticate = authenticator1+authenticator2+authenticator3
    var submit = document.getElementById('submit');
    if(authenticate == '111' && (sex.length)>0){
        submit.style.visibility = 'visible';
        submit.style.width = '100%';
    }
    else{
        submit.style.visibility = 'hidden';
        submit.style.width = '0%';
    }   
});



