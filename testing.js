var conn = require('./b-test');
var schedule = require('node-schedule');

/************FOR TESTING************/
exports.testing1 = function(req, res){
    res.send('hihihi');
    console.log("****************************************");
    const j = schedule.scheduleJob('3 * * * * *', function(){
        console.log('10sec');
    });
    
};
