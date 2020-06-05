let idAuth = 0;
let mailAuth = 0;
let sex = 0;
const userIdCheck = RegExp(/^[A-Za-z0-9_.\-]{4,30}$/);
const emailCheck = RegExp(/^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);

window.onload = () => {
    const userSexBoy = document.getElementById('boy');
    const userSexGirl = document.getElementById('girl');
    const userEmail = document.getElementById('email');
    const gender = document.getElementById('gender');
    const emailInfo = document.getElementById('emailInfo');
    const idpw = document.getElementById('idpw');
    const idButton = document.getElementById('id');
    const pwButton = document.getElementById('pw');
    const idDiv = document.getElementById('idDiv');

    idButton.addEventListener('click', function(){
        idpw.setAttribute('value', 'id');
        while ( idDiv.hasChildNodes() ) { idDiv.removeChild( idDiv.firstChild ); }
    });

    pwButton.addEventListener('click', function(){
        idpw.setAttribute('value', 'pw');
        const idInput = document.createElement('input');
        idInput.type = 'text';
        idInput.id = 'u_id';
        idInput.name = 'u_id';
        idInput.placeholder = 'Your Id';
        const idInfo = document.createElement('span');
        idInfo.id = 'idInfo';
        idInfo.className = 'registerInfo';
        idInfo.innerHTML = '30/30';
        idDiv.appendChild(idInput);
        idDiv.appendChild(idInfo);
        idInput.addEventListener('keydown', function () {
            let count = 30;
            count -= idInput.value.length;
            idInfo.innerHTML = count + '/30';
            if(idInput.value.length > 30){
                idInput.setAttribute('onkeypress', 'return false');
            }
        });

        idInput.addEventListener('focusout', function () {
            const data = {};
            data.type = 'id';
            data.data = idInput.value;
            if (userIdCheck.test(idInput.value)) {
                appearCheck(idInput);
                idInfo.innerHTML = '';
                idAuth = 1;
            } else {
                appearCross(idInput);
                idInfo.innerHTML = 'this ID does not exist';
            }
        });
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

