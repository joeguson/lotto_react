const userDao = require('../db/b-dao/userDao/userDao');
const followDao = require('../db/b-dao/userDao/followDao');
const tandyaService = require('./tandyaService');
const penobrolService = require('./penobrolService');
const youtublogService = require('./youtublogService');
const key = require('../info/beritamus-admin-2ff0df5d17ca.json');
const nodeMailer = require('nodeMailer');
let config = require('../config.json');
const jsForBack = require('../back/jsForBack.js');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: key.mail_config
});

let mailOptions = {
    from: 'admin@beritamus.com'
};

// follow 요청을 한 후 성공 여부 반환
exports.followUser = async function(source, target) {
    try {
        await followDao.insertFollowUser(source, target);
        return true;
    } catch (e) { // duplicate key
        return false;
    }
};

// unfollow 요청을 한 후 성공 여부 반환
exports.unfollowUser = async function(source, target) {
    const result = await followDao.deleteFollowUser(source, target);
    const count = result.affectedRows;
    return count > 0;
};

// 현재 상대를 follow 하고 있는 중인지 여부 반환
// 수정 필요
// exports.isFollowing = async function(source, target) {
//     const result = await followDao.select(source, target);
//     return result.length > 0;
// };

exports.searchUser = async function(string) {
    const results = await userDao.userSearch(string);
    return results[0];
};

exports.getUserArticle = async function(id2) {
    const userArticle = await Promise.all([
        penobrolService.getUserPenobrol(id2),
        tandyaService.getUserTandya(id2),
        youtublogService.getUserYoutublog(id2),
        getUserLikes(id2)
    ]);
    return userArticle;
};

exports.getUserArticleByForeigner = async function(id2, me) {
    const userArticle = await Promise.all([
        penobrolService.getUserPenobrolWithoutAnonim(id2),
        tandyaService.getUserTandyaWithoutAnonim(id2),
        youtublogService.getUserYoutublogWithoutAnonim(id2),
        await followDao.select(me, id2)
    ]);
    return userArticle;
};

exports.userLogin = async function(u_id, u_pw) {
    const result = await userDao.matchCredential(u_id, u_pw);
    if(result == null) return null;
    else return result[0];
};

exports.updateLoginDate = async function(u_id) {
    await userDao.updateLoginDate(u_id);
};

exports.verifyUserEmail = async function(email, code) {
    //get this email's code
    let verify = await userDao.userInfoByEmail(email);
    if(verify[0]){
        if(verify[0].verify === parseInt(code)){
            await userDao.verifyUser(email);
            return 1;
        }
        else return 0;
    }
    else return -1;
};

exports.checkUserCount = async function(type, data) {
    let count;
    let result = 0;

    if(type === 'id') count = await userDao.userCountById(data);
    else count = await userDao.userCountByEmail(data);

    if(parseInt(count[0].total) > 0) result = 1;
    else result = 0;
    return result;
};

exports.postUser = async function(u_id, u_pw, birthday, u_sex,  u_email, code){
    await userDao.insertUserInfo(u_id, u_pw, birthday, u_sex, u_email, code);
    mailOptions.to = u_email;
    mailOptions.subject = 'Email Verification from Beritamus';
    mailOptions.html = `
        <p>Welcome To Beritamus!</p>
        <p>Selamat Datang!</p>
        <p>Please button below</p>
        <a href="http://${config.url}/aku/register/?email=${u_email}&code=${code}">Enter Beritamus!</a>
    `;
    deliverMail(mailOptions);
};

exports.getUserBasicInfo = async function(id2){
    const result = await userDao.userInfoById(id2);
    return result[0];
};

exports.findUserInfo = async function(u_id, birthday, u_sex,  u_email){
    let check = await userDao.userBasicInfoByEmail(u_email);
    mailOptions.to = u_email;
    if(u_id){ //pw를 찾을때
        mailOptions.subject = 'Your new password for beritamus.com';
        if(check[0].u_bday === birthday && check[0].sex === u_sex && check[0].u_id === u_id){
            let tempPw = jsForBack.pwMaker();
            await userDao.updateUserPw(tempPw, u_id);
            mailOptions.html = `
                <p>This is your new password.</p>
                <p>password: <span style="text-decoration: underline">${tempPw}</span></p>'
                <p>You can change your password any time!</p>
            `;
        }
        else{
            mailOptions.html = `
                <p>Attempts were made to find your password</p>
                <p>However, some information did not match with yours</p>
                <p>Please try again or ignore this email</p>
            `;
        }
    }
    else{ //id를 찾을때
        mailOptions.subject = 'Your id information for Beritamus';
        if(check[0].u_bday === birthday && check[0].sex === u_sex){
            mailOptions.html = `
                <p>Below is your id for beritamus.com</p>
                <h2>${check[0].u_id}</h2>
            `;
        }
        else{
            mailOptions.html = `
                <p>Attempts were made to find your id</p>
                <p>However, some information did not match with yours</p>
                <p>Please try again or ignore this email</p>
            `;
        }
    }
    deliverMail(mailOptions);
};

exports.updateUserInfo = async function(pw, id2){
    const result = await userDao.updateUserInfo(pw, id2);
    return result[0];
};

/* ===== local functions ===== */
// user의 정보에 총 like 개수를 넣어주는 함수
async function getUserLikes(id2) {
    const [penobrolLikes, tandyaLikes, pcommentLikes, tanswerLikes] = await Promise.all([
        penobrolService.penobrolLikeCountByAuthor(id2),
        tandyaService.tandyaLikeCountByAuthor(id2),
        penobrolService.penobrolComLikeCountByAuthor(id2),
        tandyaService.tandyaAnsLikeCountByAuthor(id2)
    ]);
    const totalLikes = {
        "penobrol" : penobrolLikes,
        "tandya" : tandyaLikes,
        "comment" : pcommentLikes,
        "answer" : tanswerLikes
    };
    return totalLikes;
}

function deliverMail(options){
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
}