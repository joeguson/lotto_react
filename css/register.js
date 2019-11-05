var authenticator1 = '';
var authenticator2 = '';
var authenticator3 = '';
var authenticator4 = '';
var sex = '';
var userIdCheck = RegExp(/^[A-Za-z0-9_\-]{4,20}$/);
var emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
var checkboxValue;

document.getElementById('u_id').addEventListener('change', function(){
    var v = document.getElementById('u_id').value;
    if(userIdCheck.test(v)){
        sendAjax('/aku/register', v);
    }
    else{
        document.getElementById("idchecker").innerHTML = 'maaf, minta pakai yang lain';
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
        document.getElementById("idchecker").innerHTML = 'maaf, sudah dipakai';
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
        document.getElementById("pwchecker").innerHTML = 'bagus!';
        authenticator2 = '1';
    }
    else{
        document.getElementById("pwchecker").innerHTML = 'maaf, terlalu pendek. harus lebih dari 7 huruf';
        authenticator2 = '';
    }
});
document.getElementById('u_pw2').addEventListener('change', function(){
    var v = document.getElementById('u_pw').value;
    var a = document.getElementById('u_pw2').value;
    if(v == a && v.length > 7){
        document.getElementById("pwchecker").innerHTML = 'Silakan lanjutkan';
        authenticator3 = '1';
    }
    else{
        document.getElementById("pwchecker").innerHTML = 'Tidak sama';
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
    var userEmail = document.getElementById('email').value;
    if(emailCheck.test(userEmail) === true){
        authenticator4 = '1';
    } 
});

function checksubmit(){
    if(authenticator1+authenticator2+authenticator3+authenticator4 == '1111'){
        if(sex){
            if(checkboxValue=== true){
                return true;
            }
            else{return false;}
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

function checkboxCheck(target){
    checkboxValue = target.checked;
}

//var authenticate = authenticator1+authenticator2+authenticator3+authenticator4;
//
//function CheckboxCheck(checkbox){
//    var submit = document.getElementById('submit');
//    if(checkbox.checked && authenticate == '1111' && sex.length > 0){
//        console.log("The check box is checked");
//        submit.style.visibility = 'visible';
//        submit.style.width = '100%';
//    }
//    else{
//        console.log("The check box is not checked.");
//        submit.style.visibility = 'hidden';
//        submit.style.width = '0%';
//    }
//}
//
//document.getElementById('check').addEventListener('change', function(){
//    CheckboxCheck();
//});
 



