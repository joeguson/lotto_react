let idAuth = 0;
let pwAuth = 0;
let mailAuth = 0;

let sex = '';
const userIdCheck = RegExp(/^[A-Za-z0-9_.\-]{4,30}$/);
const emailCheck = RegExp(/^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
const passwordCheck = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{7,}$/);
let checkboxValue;

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

userId.addEventListener('keyup', function () {
    var count = 30;
    count -= userId.value.length;
    idInfo.innerHTML = count + '/30';
});

userId.addEventListener('blur', function () {
    if (userIdCheck.test(userId.value)) {
        sendAjax('api/aku/check', userId.value, 'id');
    } else {
        appearCross(userId);
        idInfo.innerHTML = 'maaf, minta pakai yang lain';
    }
});

userPw.addEventListener('keyup', function () {
    var count = 50;
    count -= userPw.value.length;
    pwInfo.innerHTML = count + '/50';
});

userPw2.addEventListener('keyup', function () {
    var count = 50;
    count -= userPw2.value.length;
    pwInfo.innerHTML = count + '/50';
});

userPw.addEventListener('blur', function () {
    if (passwordCheck.test(userPw.value)) {
        pwInfo.innerHTML = '';
        appearCheck(userPw);
        pwAuth = 1;
    } else {
        appearCross(userPw);
        pwInfo.innerHTML = 'maaf, terlalu pendek. harus lebih dari 7 huruf';
        pwAuth = 0;
    }
});

userPw2.addEventListener('blur', function () {
    if (userPw.value === userPw2.value && passwordCheck.test(userPw.value)) {
        pwInfo.innerHTML = '';
        appearCheck(userPw2);
        pwAuth = 2;
    } else {
        appearCross(userPw2);
        pwInfo.innerHTML = 'Tidak sama';
        pwAuth = 1;
    }
});

userSexBoy.addEventListener('click', function () {
    userSexBoy.style.backgroundColor = '#c91818';
    userSexGirl.style.backgroundColor = 'lightgrey';
    userSexBoy.style.color = 'white';
    userSexGirl.style.color = 'black';
    sex = 'laki';
    gender.setAttribute('value', 'M');
});

userSexGirl.addEventListener('click', function () {
    userSexBoy.style.backgroundColor = 'lightgrey';
    userSexGirl.style.backgroundColor = '#c91818';
    userSexGirl.style.color = 'white';
    userSexBoy.style.color = 'black';
    sex = 'perempuan';
    gender.setAttribute('value', 'F');
});


userEmail.addEventListener('blur', function () {
    if (emailCheck.test(userEmail.value) === true) {
        sendAjax('api/aku/check', userEmail.value, 'mail');
    } else {
        emailInfo.innerHTML = 'maaf, email ini tidak boleh dipakai';
        appearCross(userEmail);
        mailAuth = 0;
    }
});

function confirmRegister() {
    return confirm('Please check your email and verify to complete your sign up');
}

// Used in front/html/ja/register.pug
// noinspection JSUnusedGlobalSymbols
function checkSubmit() {
    if (idAuth && pwAuth && mailAuth && sex && checkboxValue)
        return confirmRegister();
}

// Used in front/html/ja/register.pug
// noinspection JSUnusedGlobalSymbols
function checkboxCheck(target) {
    checkboxValue = target.checked;
}

function sendAjax(url, data, checkType) {
    const sendingData = JSON.stringify({
        'type': checkType,
        'data': data
    });
    const markTarget = (checkType === 'id') ? userId : userEmail;

    const xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(sendingData);
    xhr.addEventListener('load', function () {
        let result = JSON.parse(xhr.responseText);
        if (result) {
            appearCross(markTarget);
            if (checkType === 'id') {
                idInfo.innerHTML = 'maaf, id ini sudah dipakai';
                idAuth = 0;
            } else {
                emailInfo.innerHTML = 'maaf, email ini sudah dipakai';
                mailAuth = 0;
            }
        } else {
            appearCheck(markTarget);
            if (checkType === 'id') {
                idInfo.innerHTML = '';
                idAuth = 1;
            } else {
                emailInfo.innerHTML = '';
                mailAuth = 1;
            }
        }
    });
}

function appearCross(target) {
    target.style.backgroundImage = "url('../icons/no.png')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}

function appearCheck(target) {
    target.style.backgroundImage = "url('../icons/check.png')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}
