var schedule = require('node-schedule');
var conn = require('../b');

var todayCount = 1;

exports.getChonggwalpage = function(req, res){
    var usersql = 'select count(*) AS users from users';
    var penobrolsql = 'select count(*) AS penobrol from penobrol';
    var tandyasql = 'select count(*) AS tandya from tandya';
    var pcomsql = 'select count(*) AS pcom from p_com';
    var tanssql = 'select count(*) AS tans from t_ans';

    async function getOverview() {
        var users = (await dbcon.oneArg(usersql));
        var penobrol = (await dbcon.oneArg(penobrolsql));
        var tandya = (await dbcon.oneArg(tandyasql));
        var pcom = (await dbcon.oneArg(pcomsql));
        var tans = (await dbcon.oneArg(tanssql));
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
    var overviewUsers = 'select count(*) from users';
    var overviewPen = 'select count(*) from penobrol';
    var overviewTan = 'select count(*) from tandya';
    var overviewPcom = 'select count(*) from p_com';
    var overviewTans = 'select count(*) from t_ans';
    conn.query(overviewUsers, function(err, users, fields){
        if(err){console.log(err);}
        else{
            conn.query(overviewPen, function(err, pen, fields){
                if(err){console.log(err);}
                else{
                    conn.query(overviewTan, function(err, tan, fields){
                        if(err){console.log(err);}
                        else{
                            conn.query(overviewPcom, function(err, pcom, fields){
                                if(err){console.log(err);}
                                else{
                                    conn.query(overviewTans, function(err, tans, fields){
                                        if(err){console.log(err);}
                                        else{
                                            var responseData = {'result' : 'ok', 'users': users[0], 'pen': pen[0], 'tan': tan[0], 'pcom': pcom[0], 'tans': tans[0]};
                                            res.json(responseData);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

var weeklyUpdate = schedule.scheduleJob({second: 55, minute: 59, hour:23, dayOfWeek: 0}, function(){
    var dateFrom = new Date();
    var dateTo = new Date();
    dateFrom.setDate(dateFrom.getDate() - 6);
    dateFrom = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate();
    dateTo = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate();
    var tweeklyUpdate = 'select * from tandya where date between date(?) and date (?) order by score desc limit 2';
    var pweeklyUpdate = 'select * from penobrol where date between date(?) and date (?) order by score desc limit 2';
    var weeklyUpdate = 'INSERT INTO weekly (gold_p, silver_p, bronze_p, gold_t, silver_t, bronze_t) VALUES(?)';
    var weeklyArray = [];
    conn.conn.query(tweeklyUpdate, [dateFrom, dateTo], function(err, tupdate, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(pweeklyUpdate, [dateFrom, dateTo], function(err, pupdate, fields){
                if(err){console.log(err);}
                else{
                    for(var i = 0; i<pupdate.length; i++){
                        weeklyArray.push(pupdate[i].id);
                    }
                    if(weeklyArray.length<3){
                        while(weeklyArray.length <3){
                            weeklyArray.push(0);
                        }
                    }
                    for(var j = 0; j<tupdate.length; j++){
                        weeklyArray.push(tupdate[j].id);
                    }
                    if(weeklyArray.length<6){
                        while(weeklyArray.length<6){
                            weeklyArray.push(0);
                        }
                    }
                    conn.query(weeklyUpdate, [weeklyArray], function(err, finalUpdate, fields){
                        if(err){console.log(err);}
                    });
                }
            });
        }
    });
});

var todayCountsql = 'INSERT INTO daily_count (visitCount) VALUES (?)';
var dailyVisitCount = schedule.scheduleJob({second: 59, minute: 59, hour:23}, function(){
    conn.conn.query(todayCountsql, todayCount, function(err, updateCount, field){
        if(err){console.log(err);}
        else{
            todayCount = 1;
        }
    });
});
