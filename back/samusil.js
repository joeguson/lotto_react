//url - '/samusil'
const route = require('express').Router();
var schedule = require('node-schedule');
const samusilService = require('../service/samusilService.js');

var todayCount = 1;

route.get('/', function (req, res) {
    // penobrolService.getOrderedPenobrol()
    //     .then(([dateTopics, scoreTopics]) => res.render('./jp/p', {
    //         dateTopics: dateTopics,
    //         scoreTopics: scoreTopics,
    //         id2: req.session.id2
    //     }));
    samusilService.getSamusilInfo()
        .then(([example]) => res.render('./samusil/samusil', {
            example: example
        }));
});

// var weeklyUpdate = schedule.scheduleJob({second: 55, minute: 59, hour:23, dayOfWeek: 0}, function(){
//     var dateFrom = new Date();
//     var dateTo = new Date();
//     dateFrom.setDate(dateFrom.getDate() - 6);
//     dateFrom = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate();
//     dateTo = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate();
//     var weeklyArray = [];
//
//     async function weeklyUpdateInsert() {
//         var tandyaWeek = (await backSystemDao.tWeekly(dateFrom, dateTo));
//         var penobrolWeek = (await backSystemDao.pWeekly(dateFrom, dateTo));
//         for(var i = 0; i<penobrolWeek.length; i++){
//             weeklyArray.push(penobrolWeek[i].id);
//         }
//         if(weeklyArray.length<3){
//             while(weeklyArray.length <3){
//                 weeklyArray.push(0);
//             }
//         }
//         for(var j = 0; j<tandyaWeek.length; j++){
//             weeklyArray.push(tandyaWeek[j].id);
//         }
//         if(weeklyArray.length<6){
//             while(weeklyArray.length<6){
//                 weeklyArray.push(0);
//             }
//         }
//         await backSystemDao.weeklyInsert(weeklyArray);
//     }
//     weeklyUpdateInsert();
// });
//
// var dailyVisitCount = schedule.scheduleJob({second: 59, minute: 59, hour:23}, function(){
//     async function dailyUpdateInsert() {
//         await backSystemDao.dailyUpdateInsert(todayCount);
//     }
//     dailyUpdateInsert();
// });

module.exports = route;