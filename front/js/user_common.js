function idValidityCheck(userId){
    const idCheck = RegExp(/^[A-Za-z0-9_.\-]{4,30}$/);
    return idCheck.test(userId);
}

function pwValidityCheck(userPW){
    const pwCheck = RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{7,}$/);
    return pwCheck.test(userPW);
}

function mailValidityCheck(userMail){
    const emailCheck = RegExp(/^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
    return emailCheck.test(userMail);
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