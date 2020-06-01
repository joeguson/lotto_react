let idAuth = 0;
let pwAuth = 0;
let pwAuth2 = 0;
let mailAuth = 0;
let sex = 0;
const userIdCheck = RegExp(/^[A-Za-z0-9_.\-]{4,30}$/);
const emailCheck = RegExp(/^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
const passwordCheck = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{7,}$/);

window.onload = () => {
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

    userId.addEventListener('keydown', function () {
        let count = 30;
        count -= userId.value.length;
        idInfo.innerHTML = count + '/30';
        if(userId.value.length > 30){
            userId.setAttribute('onkeypress', 'return false');
        }
    });
    userPw.addEventListener('keydown', function () {
        let count = 50;
        count -= userPw.value.length;
        pwInfo.innerHTML = count + '/50';
        if(userPw.value.length > 50){
            userPw.setAttribute('onkeypress', 'return false');
        }
    });
    userPw2.addEventListener('keydown', function () {
        let count = 50;
        count -= userPw2.value.length;
        pwInfo.innerHTML = count + '/50';
        if(userPw.value.length > 50){
            userPw.setAttribute('onkeypress', 'return false');
        }
    });

    userId.addEventListener('focusout', function () {
        const data = {};
        data.type = 'id';
        data.data = userId.value;

        if (userIdCheck.test(userId.value)) {
            makeRequest('post', 'api/aku/check', data)
                .then((result) => {
                    if(result === 'true'){
                        appearCross(userId);
                        idInfo.innerHTML = 'sorry, already used';
                        idAuth = 0;
                    }
                    else{
                        appearCheck(userId);
                        idInfo.innerHTML = 'confirmed';
                        idAuth = 1;
                    }
                });
        } else {
            appearCross(userId);
            idInfo.innerHTML = 'please, use different ID';
        }
    });

    userPw.addEventListener('focusout', function () {
        //length check
        if(userPw.value.length >= 7){
            if (passwordCheck.test(userPw.value)) {
                pwInfo.innerHTML = 'confirm your password 1 more time';
                appearCheck(userPw);
                pwAuth = 1;
            }
            else {
                appearCross(userPw);
                pwInfo.innerHTML = 'include at least 1 character & 1 number & 1 special character';
                pwAuth = 0;
            }
        }
         else {
            appearCross(userPw);
            pwInfo.innerHTML = 'too short, must be longer than 7 words';
            pwAuth = 0;
        }
    });

    userPw2.addEventListener('focusout', function () {
        if (userPw.value === userPw2.value && passwordCheck.test(userPw.value)) {
            pwInfo.innerHTML = '';
            appearCheck(userPw2);
            pwAuth2 = 1;
        } else {
            appearCross(userPw2);
            pwInfo.innerHTML = 'does not match';
            pwAuth2 = 0;
        }
    });

    userSexBoy.addEventListener('click', function () {
        userSexBoy.style.backgroundColor = '#a13525';
        userSexGirl.style.backgroundColor = 'lightgrey';
        userSexBoy.style.color = 'white';
        userSexGirl.style.color = 'black';
        sex = 1;
        gender.setAttribute('value', 'M');
    });

    userSexGirl.addEventListener('click', function () {
        userSexBoy.style.backgroundColor = 'lightgrey';
        userSexGirl.style.backgroundColor = '#a13525';
        userSexGirl.style.color = 'white';
        userSexBoy.style.color = 'black';
        sex = 1;
        gender.setAttribute('value', 'F');
    });


    userEmail.addEventListener('focusout', function () {
        const data = {};
        data.type = 'mail';
        data.data = userEmail.value;
        if (emailCheck.test(userEmail.value) === true) {
            makeRequest('post', 'api/aku/check', data)
                .then((result) => {
                    if(result === 'true'){
                        appearCross(userEmail);
                        emailInfo.innerHTML = 'maaf, sudah dipakai';
                        mailAuth = 0;
                    }
                    else{
                        appearCheck(userEmail);
                        emailInfo.innerHTML = 'silakan';
                        mailAuth = 1;
                    }
                });
        } else {
            emailInfo.innerHTML = 'maaf, email ini tidak boleh dipakai';
            appearCross(userEmail);
            mailAuth = 0;
        }
    });


};

// Used in front/html/ja/register.pug
// noinspection JSUnusedGlobalSymbols
function checkSubmit() {
    if (idAuth && pwAuth && pwAuth2 && mailAuth && sex){
        return confirmRegister();
    }
    else{
        alert('please check all the criteria');
        return false;
    }
}
function confirmRegister() {
    return confirm('Please check your email and verify to complete your sign up');
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

