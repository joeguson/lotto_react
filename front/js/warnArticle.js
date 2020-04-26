function __selectWarnFunc(warn_target) {
    return (warned_id) => {
        let data = {warned_id: warned_id};
        const url = '/api/warn/'+ warn_target;
        makeRequest('POST', url, data)
            .then(res => {
                alert("Success warning this " + warn_target);
            }).catch(res => {
            alert("You already warn this " + warn_target);
        })
    }
}

/* ===== POST /{type}/warn ===== */
/* ===== Article ===== */

warnPenobrol = __selectWarnFunc("penobrol/article");
warnTandya = __selectWarnFunc("tandya/article");
warnYoutublog = __selectWarnFunc('youtublog/article');

/* ===== POST /{type}/reply/warn ===== */
/* ===== Reply ===== */

warnPenobrolCom = __selectWarnFunc("penobrol/reply");
warnTandyaAns = __selectWarnFunc("tandya/reply");
warnYoutublogCom = __selectWarnFunc('youtublog/reply');

/* ===== POST /{type}/re-reply/warn ===== */
/* ===== Re-reply ===== */

warnPenobrolComCom = __selectWarnFunc("penobrol/rereply");
warnTandyaAnsCom = __selectWarnFunc("tandya/rereply");
warnYoutublogComCom = __selectWarnFunc('youtublog/rereply');
