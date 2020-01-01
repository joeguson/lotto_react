var idAuth = 0;
var pwAuth = 0;
var mailAuth = 0;

var sex = '';
var userIdCheck = RegExp(/^[A-Za-z0-9_\-]{4,20}$/);
var emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
var checkboxValue;

const userId = document.getElementById('u_id');
const userPw = document.getElementById('u_pw');
const userPw2 = document.getElementById('u_pw2');
const userSexBoy = document.getElementById('boy');
const userSexGirl = document.getElementById('girl');
const userEmail = document.getElementById('email');
const gender = document.getElementById('gender');
const information = document.getElementById('information');

userId.addEventListener('blur', function(){
    if(userIdCheck.test(userId.value)){
        sendAjax('/aku/register', userId.value, 'id');
    }
    else{
        appearCross(userId);
        information.innerHTML = 'maaf, minta pakai yang lain';
    }
});

userPw.addEventListener('blur', function(){
    if(userPw.value.length > 7){
        appearCheck(userPw);
        pwAuth = 1;
    }
    else{
        appearCross(userPw);
        information.innerHTML = 'maaf, terlalu pendek. harus lebih dari 7 huruf';
        pwAuth = 0;
    }
});

userPw2.addEventListener('blur', function(){
    if(userPw.value == userPw2.value && userPw.value.length > 7){
        appearCheck(userPw2);
        pwAuth = 2;
    }
    else{
        appearCross(userPw2);
        information.innerHTML = 'Tidak sama';
        pwAuth = 1;
    }
});

userSexBoy.addEventListener('click', function(){
    userSexBoy.style.backgroundColor = '#c91818';
    userSexGirl.style.backgroundColor = 'lightgrey';
    userSexBoy.style.color ='white';
    userSexGirl.style.color ='black';
    sex = 'laki';
    gender.setAttribute('value', 'M');
});

userSexGirl.addEventListener('click', function(){
    userSexBoy.style.backgroundColor = 'lightgrey';
    userSexGirl.style.backgroundColor = '#c91818';
    userSexGirl.style.color ='white';
    userSexBoy.style.color ='black';
    sex = 'perempuan';
    gender.setAttribute('value', 'F');
});

userEmail.addEventListener('blur', function(){
    if(emailCheck.test(userEmail.value) === true){
        sendAjax('/aku/register', userEmail.value, 'mail');
    }
    else{
        information.innerHTML = 'maaf, email ini tidak boleh dipakai';
        appearCross(userEmail);
        mailAuth = 0;
    }
});

function confirmRegister(){
    return confirm('Please check your email and verify to complete your sign up');
}

function checksubmit(){
    console.log(idAuth);
    console.log(pwAuth);
    console.log(sex);
    console.log(checkboxValue);
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

function sendAjax(url, data, checkType){
    var sendingData = (checkType == 'id') ? {'type' : checkType, 'data' : data} : {'type' : checkType, 'data' : data}
    var markTarget = (checkType == 'id') ? userId : userEmail;
    sendingData = JSON.stringify(sendingData);
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(sendingData);
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        if(result.result !== 'ok') return;
         // 데이터가 있으면 결과값 표시
        if(parseInt(result.length) > 0){
            appearCross(markTarget);
            if(checkType == 'id'){
                information.innerHTML = 'maaf, id ini sudah dipakai';
                idAuth = 0;
            }
            else{
                information.innerHTML = 'maaf, email ini sudah dipakai';
                mailAuth = 0;
            }
        }
        else{
            appearCheck(markTarget);
            if(checkType == 'id'){
                information.innerHTML = '';
                idAuth = 1;
            }
            else{
                information.innerHTML = '';
                mailAuth = 1;
            }
        }
    });
}

function appearCross(target){
    target.style.backgroundImage = "url('../no.svg')";
    target.style.backgroundImage = "url('../no.svg')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}
function appearCheck(target){
    target.style.backgroundImage = "url('../check.svg')";
    target.style.backgroundImage = "url('../check.svg')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
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
