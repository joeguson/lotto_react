let pwAuth = 0;
let pwAuth2 = 0;
let start = true;

window.onload = () => {
    const userPw = document.getElementById('u_pw');
    const userPw2 = document.getElementById('u_pw2');
    const pwInfo = document.getElementById('pwInfo');

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
        if(userPw2.value.length > 50){
            userPw2.setAttribute('onkeypress', 'return false');
        }
    });

    userPw.addEventListener('focusout', function () {
        //length check
        if(userPw.value.length >= 7){
            if (pwValidityCheck(userPw.value)) {
                if(confirm('use this pw')){
                    pwInfo.innerHTML = 'confirmed';
                    appearCheck(userPw);
                    userPw.readOnly = true;
                    pwAuth = 1;
                }
                else{
                    appearCross(userPw2);
                    pwAuth = 0;
                }
            }
            else {
                appearCross(userPw);
                pwInfo.innerHTML = 'include at least 1 character & 1 number & 1 special character';
                userPw2.focus();
                pwAuth = 0;
            }
        }
        else {
            appearCross(userPw);
            pwInfo.innerHTML = 'too short, must be longer than 7 words';
            userPw2.focus();
            pwAuth = 0;
        }
    });

    userPw2.addEventListener('focusout', function () {
        if (userPw.value === userPw2.value && pwValidityCheck(userPw.value)) {
            if(confirm('use this pw')){
                pwInfo.innerHTML = 'confirmed';
                appearCheck(userPw2);
                userPw2.readOnly = true;
                pwAuth2 = 1;
            }
            else{
                appearCross(userPw2);
                pwAuth2 = 0;
            }
        } else {
            appearCross(userPw2);
            pwInfo.innerHTML = 'does not match';
            pwAuth2 = 0;
        }
    });
}

if(start){
    start = false;
    function checkSubmit() {
        if (pwAuth && pwAuth2){
            return confirmRegister();
        }
        else{
            alert('please check all the criteria');
            start = true;
            return false;
        }
    }
}

function confirmRegister(){
    return confirm('you have a new password!');
}

