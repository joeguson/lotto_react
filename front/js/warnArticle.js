function __selectWarnFunc(warn_target) {
    return (warned_id) => {
        let data = {warned_id: warned_id};
        const url = 'api/warn/'+ warn_target;
        makeRequest('POST', url, data)
            .then(() => {
                alert("Success warning this " + warn_target);
            }).catch(() => {
            alert("You already warn this " + warn_target);
        })
    }
}

/* ===== POST /{type}/warn ===== */
/* ===== Article ===== */

const warnPenobrol = __selectWarnFunc('penobrol/article');
const warnTandya = __selectWarnFunc('tandya/article');
const warnYoutublog = __selectWarnFunc('youtublog/article');

/* ===== POST /{type}/reply/warn ===== */
/* ===== Reply ===== */

const warnPenobrolCom = __selectWarnFunc('penobrol/reply');
const warnTandyaAns = __selectWarnFunc('tandya/reply');
const warnYoutublogCom = __selectWarnFunc('youtublog/reply');

/* ===== POST /{type}/re-reply/warn ===== */
/* ===== Re-reply ===== */

const warnPenobrolComCom = __selectWarnFunc('penobrol/rereply');
const warnTandyaAnsCom = __selectWarnFunc('tandya/rereply');
const warnYoutublogComCom = __selectWarnFunc('youtublog/rereply');
