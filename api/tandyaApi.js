//url - '/api/tandya'
const route = require('express').Router();
const tandyaService = require('../service/tandyaService.js');

/* ===== tandya ===== */


// exports.getOrderedTandya = function(req, res) {
//     tandyaService.getOrderedTandya()
//         .then(([dateTopics, scoreTopics]) => res.json({
//             dateTopics: dateTopics,
//             scoreTopics: scoreTopics
//         }));
// };

module.exports = route;