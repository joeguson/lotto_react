function __selectWarnFunc(warn_target) {
    return (warned_id) => {
        let data = {warned_id: warned_id};
        console.log(data);
        const url = '/api/article/'+ warn_target +'/warn';
        makeRequest('POST', url, data)
            .then(res => {
                alert("Success warning this " + warn_target);
            }).catch(res => {
            alert("You already warn this " + warn_target);
        })
    }
}
////////////////{type}/warn////////////////
//////////////////article//////////////////

warnPenobrol = __selectWarnFunc("penobrol");
warnTandya = __selectWarnFunc("tandya");
warnYoutublog = __selectWarnFunc('youtublog');

///////////////{type}/reply/warn///////////////
////////////////////reply////////////////////
warnPenobrolCom = __selectWarnFunc("penobrol/reply");
warnTandyaAns = __selectWarnFunc("tandya/reply");
warnYoutublogCom = __selectWarnFunc('youtublog/reply');

///////////////{type}/re-reply/warn///////////////
////////////////////re-reply////////////////////
warnPenobrolComCom = __selectWarnFunc("penobrol/re-reply");
warnTandyaAnsCom = __selectWarnFunc("tandya/re-reply");
warnYoutublogComCom = __selectWarnFunc('youtublog/re-reply');