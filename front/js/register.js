window.onload = ()=>{
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

    userId.addEventListener('keydown', function () {
        let count = 30;
        count -= userId.value.length;
        idInfo.innerHTML = count + '/30';
        if(userId.value.length > 30){
            userId.setAttribute('onkeypress', 'return false');
        }
    });

    userId.addEventListener('blur', function () {
        const data = {};
        data.type = 'id';
        data.data = userId.value;

        if (userIdCheck.test(userId.value)) {
            makeRequest('post', 'api/aku/check', data)
                .then((result) => {
                    if(result === 'true'){
                        appearCross(userId);
                        idInfo.innerHTML = 'maaf, sudah dipakai';
                    }
                    else{
                        appearCheck(userId);
                        idInfo.innerHTML = 'silakan';
                    }
                });
        } else {
            appearCross(userId);
            idInfo.innerHTML = 'maaf, minta pakai yang lain';
        }
    });

    userPw.addEventListener('keyup', function () {
        var count = 50;
        count -= userPw.value.length;
        pwInfo.innerHTML = count + '/50';
        if(userPw.value.length > 50){
            userPw.setAttribute('onkeypress', 'return false');
        }
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
        userSexBoy.style.backgroundColor = '#a13525';
        userSexGirl.style.backgroundColor = 'lightgrey';
        userSexBoy.style.color = 'white';
        userSexGirl.style.color = 'black';
        sex = 'laki';
        gender.setAttribute('value', 'M');
    });

    userSexGirl.addEventListener('click', function () {
        userSexBoy.style.backgroundColor = 'lightgrey';
        userSexGirl.style.backgroundColor = '#a13525';
        userSexGirl.style.color = 'white';
        userSexBoy.style.color = 'black';
        sex = 'perempuan';
        gender.setAttribute('value', 'F');
    });


    userEmail.addEventListener('blur', function () {
        const data = {};
        data.type = 'mail';
        data.data = userEmail.value;
        if (emailCheck.test(userEmail.value) === true) {
            makeRequest('post', 'api/aku/check', data)
                .then((result) => {
                    if(result === 'true'){
                        appearCross(userId);
                        emailInfo.innerHTML = 'maaf, sudah dipakai';
                    }
                    else{
                        appearCheck(userId);
                        emailInfo.innerHTML = 'silakan';
                    }
                });
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
};


