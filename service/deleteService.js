//delete
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const pcDao = require('../db/b-dao/penDao/pcDao');
const pccDao = require('../db/b-dao/penDao/pccDao');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const tacDao = require('../db/b-dao/tanDao/tacDao');
const taDao = require('../db/b-dao/tanDao/taDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
const yccDao = require('../db/b-dao/youDao/yccDao');
const ycDao = require('../db/b-dao/youDao/ycDao');

exports.deletePenobrol = deleteProcess(penobrolDao.penobrolById, penobrolDao.deletePenobrol);
exports.deletePComment = deleteProcess(pcDao.penobrolComById, pcDao.deletePenobrolCom);
exports.deletePCComment = deleteProcess(pccDao.penobrolComComById, pccDao.deletePenobrolComCom);

exports.deleteTandya = deleteProcess(tandyaDao.tandyaById, tandyaDao.deleteTandya);
exports.deleteAnswer = deleteProcess(taDao.tandyaAnsById, taDao.deleteTandyaAns);
exports.deleteAComment = deleteProcess(tacDao.tandyaAnsComById, tacDao.deleteTandyaAnsCom);

exports.deleteYoutublog = deleteProcess(youtublogDao.youtublogById, youtublogDao.deleteYoutublog);
exports.deleteYComment = deleteProcess(ycDao.youtublogComById, ycDao.deleteYoutublogCom);
exports.deleteYCComment = deleteProcess(yccDao.youtublogComComById, yccDao.deleteYoutublogComCom);


function deleteProcess(byIdFunc, deleteFunc){
    return async (targetId, userId) => {
        const p = (await byIdFunc(targetId))[0];
        if (p == null || userId !== p.author) return false;
        await deleteFunc(targetId);
        return true;
    };
}