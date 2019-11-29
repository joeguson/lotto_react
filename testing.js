var conn = require('./b-test');

/************FOR TESTING************/
exports.testing1 = function(req, res){
    res.render('p-add2');
};
exports.testing2 = function(req, res){
    console.log(req.file);
    res.send('Uploaded : '+req.file.filename);
};