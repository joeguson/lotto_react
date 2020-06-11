let idAuth = 0;
let mailAuth = 0;
let sex = 0;
let id = true;

window.onload = () => {
    const userEmail = document.getElementById('email');
    const emailInfo = document.getElementById('emailInfo');
    const idpw = document.getElementById('idpw');
    const idButton = document.getElementById('id');
    const pwButton = document.getElementById('pw');
    const idDiv = document.getElementById('idDiv');

    idButton.addEventListener('click', function(){
        idpw.setAttribute('value', 'id');
        id = true;
        while ( idDiv.hasChildNodes() ) { idDiv.removeChild( idDiv.firstChild ); }
    });

    pwButton.addEventListener('click', function(){
        if(id){
            id = !id;
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
            idInput.addEventListener('focusout', function () {
                const data = {};
                data.type = 'id';
                data.data = idInput.value;
                if (idValidityCheck(idInput.value)) {
                    appearCheck(idInput);
                    idInfo.innerHTML = '';
                    idAuth = 1;
                } else {
                    appearCross(idInput);
                    idInfo.innerHTML = 'this ID does not exist';
                }
            });
        }
    });

    userEmail.addEventListener('focusout', function () {
        const data = {};
        data.type = 'mail';
        data.data = userEmail.value;
        if (mailValidityCheck(userEmail.value)) {
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
