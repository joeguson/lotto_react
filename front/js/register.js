var idAuth = 0;
var pwAuth = 0;
var mailAuth = 0;

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

document.getElementById('u_pw').addEventListener('change', function(){
    var v = document.getElementById('u_pw').value;
    if(v.length > 7){
        document.getElementById("pwchecker").innerHTML = 'bagus';
        pwAuth = 1;
    }
    else{
        document.getElementById("pwchecker").innerHTML = 'maaf, terlalu pendek. harus lebih dari 7 huruf';
        pwAuth = 0;
    }
});
document.getElementById('u_pw2').addEventListener('change', function(){
    var v = document.getElementById('u_pw').value;
    var a = document.getElementById('u_pw2').value;
    if(v == a && v.length > 7){
        document.getElementById("pwchecker").innerHTML = 'Silakan lanjutkan';
        pwAuth = 2;
    }
    else{
        document.getElementById("pwchecker").innerHTML = 'Tidak sama';
        pwAuth = 1;
    }
});

document.getElementById('boy').addEventListener('click', function(){
    var laki = document.getElementById('boy');
    var perem = document.getElementById('girl');
    laki.style.backgroundColor = '#c91818';
    perem.style.backgroundColor = 'lightgrey';
    sex = 'laki';
    var gender = document.getElementById('gender');
    gender.setAttribute('value', 'M');
});

document.getElementById('girl').addEventListener('click', function(){
    var laki = document.getElementById('boy');
    var perem = document.getElementById('girl');
    laki.style.backgroundColor = 'lightgrey';
    perem.style.backgroundColor = '#c91818';
    sex = 'perempuan';
    var gender = document.getElementById('gender');
    gender.setAttribute('value', 'F');
});


document.getElementById('email').addEventListener('change', function(){
    var userEmail = document.getElementById('email').value;
    if(emailCheck.test(userEmail) === true){
        sendAjax('/aku/register', userEmail);
        mailAuth = 1;
    }
    else{
        mailAuth = 0;
    }
});

function confirmRegister(){
    return confirm('Please check your email and verify to complete your sign up');
}

function checksubmit(){
    console.log(idAuth);
    console.log(pwAuth);
    console.log(mailAuth);
    if(idAuth){
        if(pwAuth){
            if(mailAuth){
                if(sex){
                    if(checkboxValue=== true){
                        var confirmR = confirmRegister();
                        if(confirmR ===true){
                            return true;
                        }
                        else{return false;}
                    }
                    else{return false;}
                }
                else{return false;}
            }
            else{return false;}
        }
        else{return false;}
    }
    else{return false;}
}

function checkboxCheck(target){
    checkboxValue = target.checked;
}

function sendAjax(url, data){
    var data2 = {'u_id' : data};
    data2 = JSON.stringify(data2);
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data2);
    xhr.addEventListener('load', function(){
    var result = JSON.parse(xhr.responseText);
    if(result.result !== 'ok') return;
     // 데이터가 있으면 결과값 표시
    if(parseInt(result.u_id) > 0){
        document.getElementById("idchecker").innerHTML = 'maaf, sudah dipakai';
        idAuth = 0;
    }
    else{
        document.getElementById("idchecker").innerHTML = 'silakan';
        idAuth = 1;
    }
    });
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
