var schedule = require('node-schedule');
var parser = require('../db/parser.js');
var jsForBack = require('../back/jsForBack.js');
var backSystemDao = require('..//db/b-dao/backSystemDao');

var todayCount = 1;

exports.getChonggwalpage = function(req, res){
    async function getOverview() {
        var users = (await backSystemDao.countUsers());
        var penobrol = (await backSystemDao.countPenobrol());
        var tandya = (await backSystemDao.countTandya());
        var pcom = (await backSystemDao.countComments());
        var tans = (await backSystemDao.countAnswers());
        res.render('chonggwalpage', {
            'users': users[0],
            'pen': penobrol[0],
            'tan': tandya[0],
            'pcom': pcom[0],
            'tans': tans[0]
        });
    }
    getOverview();
}

exports.postChonggwalpage = function(req, res){
    async function postOverview() {
        var users = (await backSystemDao.countUsers());
        var penobrol = (await backSystemDao.countPenobrol());
        var tandya = (await backSystemDao.countTandya());
        var pcom = (await backSystemDao.countComments());
        var tans = (await backSystemDao.countAnswers());
        var responseData = {
            'result' : 'ok',
            'users': users[0],
            'pen': pen[0],
            'tan': tan[0],
            'pcom': pcom[0],
            'tans': tans[0]
        };
        res.json(responseData);
    }
    postOverview();
}

var weeklyUpdate = schedule.scheduleJob({second: 55, minute: 59, hour:23, dayOfWeek: 0}, function(){
    var dateFrom = new Date();
    var dateTo = new Date();
    dateFrom.setDate(dateFrom.getDate() - 6);
    dateFrom = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate();
    dateTo = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate();
    var weeklyArray = [];

    async function weeklyUpdateInsert() {
        var tandyaWeek = (await backSystemDao.tWeekly(dateFrom, dateTo));
        var penobrolWeek = (await backSystemDao.pWeekly(dateFrom, dateTo));
        for(var i = 0; i<penobrolWeek.length; i++){
            weeklyArray.push(penobrolWeek[i].id);
        }
        if(weeklyArray.length<3){
            while(weeklyArray.length <3){
                weeklyArray.push(0);
            }
        }
        for(var j = 0; j<tandyaWeek.length; j++){
            weeklyArray.push(tandyaWeek[j].id);
        }
        if(weeklyArray.length<6){
            while(weeklyArray.length<6){
                weeklyArray.push(0);
            }
        }
        await backSystemDao.weeklyInsert(weeklyArray);
    }
    weeklyUpdateInsert();
});

var dailyVisitCount = schedule.scheduleJob({second: 59, minute: 59, hour:23}, function(){
    async function dailyUpdateInsert() {
        await backSystemDao.dailyUpdateInsert(todayCount);
    }
    dailyUpdateInsert();
});
