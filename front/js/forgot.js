var idAuth = 0;
var pwAuth = 0;
var mailAuth = 0;

var sex = '';
var userIdCheck = RegExp(/^[A-Za-z0-9_.\-]{4,30}$/);
var emailCheck = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);

const userId = document.getElementById('u_id');
const userIdP = document.getElementById('userIdP');
const userSexBoy = document.getElementById('boy');
const userSexGirl = document.getElementById('girl');
const userEmail = document.getElementById('email');
const idButton = document.getElementById('id');
const pwButton = document.getElementById('pw');
const idOrPw = document.getElementById('idOrPw');

idButton.addEventListener('click', function(){
    userIdP.style.visibility= 'hidden';
    idOrPw.setAttribute('value', 'id');
});

pwButton.addEventListener('click', function(){
    userIdP.style.visibility= 'visible';
    idOrPw.setAttribute('value', 'pw');
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
    return confirm('Please check your email');
}

function checksubmit(){
    if(idOrPw.value == 'id'){
        if(emailCheck.test(userEmail.value)){
            if(sex){
                var confirmR = confirmRegister();
                if(confirmR ===true){
                    return true;
                }else{return false;}
            }else{return false;}
        }else{return false;}
    }else{
        if(userIdCheck.test(userId.value)){
            if(emailCheck.test(userEmail.value)){
                if(sex){
                    var confirmR = confirmRegister();
                    if(confirmR ===true){
                        return true;
                    }else{return false;}
                }else{return false;}
            }else{return false;}
        }else{return false;}
    }
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
