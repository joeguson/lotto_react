let pwAuth = 0;

const userPw = document.getElementById('u_pw');
const userPw2 = document.getElementById('u_pw2');
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

function confirmRegister(){
    return confirm('you have a new password!');
}

function checksubmit(){
    if(pwAuth){
        var confirmR = confirmRegister();
        if(confirmR ===true) return true;
        else return false;
    }
    else return false;
}

function appearCross(target){
    target.style.backgroundImage = "url('../icons/no.png')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}
function appearCheck(target){
    target.style.backgroundImage = "url('../icons/check.png')";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "99%";
    target.style.backgroundSize = "2%";
    target.style.backgroundColor = "white";
}
