var pwAuth = 0;
var mailAuth = 0;

var sex = '';

const userPw = document.getElementById('u_pw');
const userPw2 = document.getElementById('u_pw2');
const userSexBoy = document.getElementById('boy');
const userSexGirl = document.getElementById('girl');
const gender = document.getElementById('gender');
const pwInfo = document.getElementById('pwInfo');

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

function confirmRegister(){
    return confirm('Please check your email and verify to complete your sign up');
}

function checksubmit(){
    if(pwAuth){
        if(sex){
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

function appearCross(target){
    target.style.backgroundImage = "url('../icons/no.svg')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}
function appearCheck(target){
    target.style.backgroundImage = "url('../icons/check.svg')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}
