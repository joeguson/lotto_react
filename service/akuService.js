const userDao = require('../db/b-dao/userDao/userDao');
const followDao = require('../db/b-dao/userDao/followDao');
const articleService = require('./articleService');
const likeService = require('./likeService');
const nodeMailer = require('nodemailer');
let config = require('../config.json');
const jsForBack = require('../back/jsForBack.js');

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: config.key.mail_config
});

let mailOptions = {
    from: 'admin@beritamus.com'
};

//login
exports.userLogin = async function(u_id, u_pw) {
    const result = await userDao.matchCredential(u_id, u_pw);
    if(result[0]){
        if(result[0].verify === 1) return result[0]; //match credential
        else return 0; //match but email not verified
    }
    else return -1; //no result
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

exports.isFollowing = async function(source, target) {
    const result = await followDao.select(source, target);
    return result;
};

exports.countFollow = async function(id2) {
    const follow = {};
    const [countFollowing, countFollower] = await Promise.all([
        followDao.countFollowing(id2),
        followDao.countFollower(id2)
    ]);
    follow.following = countFollowing[0].following;
    follow.follower = countFollower[0].follower;
    return follow;
};

exports.countFollowByForeigner = async function(userId) {
    const id2 = (await userDao.getUserId2(userId))[0].id;
    const follow = {};
    const [countFollowing, countFollower] = await Promise.all([
        followDao.countFollowing(id2),
        followDao.countFollower(id2)
    ]);
    follow.following = countFollowing[0].following;
    follow.follower = countFollower[0].follower;
    return follow;
};

exports.getUserArticle = async function(id2) {
    return await Promise.all([
        articleService.getArticleByAuthor(id2, 'penobrol'),
        articleService.getArticleByAuthor(id2, 'tandya'),
        articleService.getArticleByAuthor(id2, 'youtublog'),
        getUserLikes(id2)
    ]);
};

exports.getUserArticleByForeigner = async function(id2, me) {
    return await Promise.all([
        articleService.getArticleByAuthorWithoutAnonim(id2, 'penobrol'),
        articleService.getArticleByAuthorWithoutAnonim(id2, 'tandya'),
        articleService.getArticleByAuthorWithoutAnonim(id2, 'youtublog'),
        await followDao.select(me, id2)
    ]);
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

exports.checkUserDataExists = async function(type, data) {
    let count;

    if(type === 'id') count = await userDao.userCountById(data);
    else count = await userDao.userCountByEmail(data);

    return parseInt(count[0].total) > 0;
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
    const [penobrolLikes, tandyaLikes, youtublogLikes, pcommentLikes, tanswerLikes, ycommentLikes] = await Promise.all([
        likeService.articleLikeCountByAuthor(id2, 'penobrol'),
        likeService.articleLikeCountByAuthor(id2, 'tandya'),
        likeService.articleLikeCountByAuthor(id2, 'youtublog'),
        likeService.replyLikeCountByAuthor(id2, 'penobrol'),
        likeService.replyLikeCountByAuthor(id2, 'tandya'),
        likeService.replyLikeCountByAuthor(id2, 'youtublog')
    ]);
    return {
        "penobrol": penobrolLikes,
        "tandya": tandyaLikes,
        "youtublog": youtublogLikes,
        "pcomment": pcommentLikes,
        "answer": tanswerLikes,
        "ycomment": ycommentLikes
    };
}

function deliverMail(options){
    transporter.sendMail(options, (error) => {
        if (error) {
            console.log(error);
        }
    });
}