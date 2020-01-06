var idAuth = 0;
var pwAuth = 0;
var mailAuth = 0;

var sex = '';
var userIdCheck = RegExp(/^[A-Za-z0-9_.\-]{4,30}$/);
var emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
var checkboxValue;

const userId = document.getElementById('u_id');
const userPw = document.getElementById('u_pw');
const userPw2 = document.getElementById('u_pw2');
const userSexBoy = document.getElementById('boy');
const userSexGirl = document.getElementById('girl');
const userEmail = document.getElementById('email');
const gender = document.getElementById('gender');
const idInfo = document.getElementById('idInfo');
const pwInfo = document.getElementById('pwInfo');
const emailInfo = document.getElementById('emailInfo');

userId.addEventListener('keyup', function(){
    var count = 30;
    count -= userId.value.length;
    idInfo.innerHTML = count + '/30';
});

userId.addEventListener('blur', function(){
    if(userIdCheck.test(userId.value)){
        sendAjax('/aku/register', userId.value, 'id');
    }
    else{
        appearCross(userId);
        idInfo.innerHTML = 'maaf, minta pakai yang lain';
    }
});

userPw.addEventListener('keyup', function(){
    var count = 50;
    count -= userPw.value.length;
    pwInfo.innerHTML = count + '/50';
})
userPw2.addEventListener('keyup', function(){
    var count = 50;
    count -= userPw2.value.length;
    pwInfo.innerHTML = count + '/50';
})

userPw.addEventListener('blur', function(){
    if(userPw.value.length > 7){
        pwInfo.innerHTML = '';
        appearCheck(userPw);
        pwAuth = 1;
    }
    else{
        appearCross(userPw);
        pwInfo.innerHTML = 'maaf, terlalu pendek. harus lebih dari 7 huruf';
        pwAuth = 0;
    }
});

userPw2.addEventListener('blur', function(){
    if(userPw.value == userPw2.value && userPw.value.length > 7){
        pwInfo.innerHTML = '';
        appearCheck(userPw2);
        pwAuth = 2;
    }
    else{
        appearCross(userPw2);
        pwInfo.innerHTML = 'Tidak sama';
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
        emailInfo.innerHTML = 'maaf, email ini tidak boleh dipakai';
        appearCross(userEmail);
        mailAuth = 0;
    }
});

function confirmRegister(){
    return confirm('Please check your email and verify to complete your sign up');
}

function checksubmit(){
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
                idInfo.innerHTML = 'maaf, id ini sudah dipakai';
                idAuth = 0;
            }
            else{
                emailInfo.innerHTML = 'maaf, email ini sudah dipakai';
                mailAuth = 0;
            }
        }
        else{
            appearCheck(markTarget);
            if(checkType == 'id'){
                idInfo.innerHTML = '';
                idAuth = 1;
            }
            else{
                emailInfo.innerHTML = '';
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
