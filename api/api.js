//url - '/api'
const imageThumbnail = require('image-thumbnail');
const jsForBack = require('../back/jsForBack.js');
const ogs = require('open-graph-scraper');
const api = require('express').Router();
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');
const samusil = require('./samusilApi');
const article = require('./articleApi');
const youtube = require('./youtubeApi');

const config =require('../config.json');
const AWS = require('aws-sdk');
const s3 = new AWS.S3(config.aws_config);

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/samusil', samusil);
api.use('/article', article);
api.use('/youtube', youtube);

api.delete('/image', (req, res) => {
    // let img = req.body.img;
    deleteImage("images", filename, (err) => {
        if(err) {
            console.log("err: ", err);
            /* Raise error */
        } else {
            deleteImage("images/thumbnail", filename,(err) => {
                if(err) {
                    console.log("err: ", err);
                    /* Raise error */
                } else {
                    res.json({"message" : "deleted"});
                }
            })
        }
    });
});

api.post('/image', (req, res) => {
    let img = req.body.img;
    let data =img.replace(/^data:image\/\w+;base64,/, "");
    let filename = jsForBack.generateFilename();

    switch (img.split(";")[0].split("/")[1]) {
        case "jpeg": filename += '.jpg'; break;
        case "gif": filename += '.gif'; break;
        case "x-icon": filename += '.ico'; break;
        case "png": filename += '.png'; break;
        default: /* Raise error */ break;
    }
    imageThumbnail(data).then((thumbnail) => {
        saveImage("images", filename, data, (err) => {
            if(err) {
                console.log("err: ", err);
                /* Raise error */
            } else {
                saveImage("images/thumbnail", filename, thumbnail, (err) => {
                    if(err) {
                        console.log("err: ", err);
                        /* Raise error */
                    } else {
                        res.json({'filename': filename});
                    }
                })
            }
        });
    });
});

api.post('/opengraph', (req, res) => {
    let urlSource = req.body.urlSource;
    let options = {'url': urlSource, 'encoding': 'utf8'};
    ogs(options, function (error, results) {
        res.json({'ogs': results});
    });
});

module.exports = api;

function saveImage(path, filename, data, callback) {
    const params = {
        'Bucket':'beritamus',
        'Key': path + "/" + filename,
        'ACL':'public-read',
        'ContentEncoding': 'base64',
        'Body': Buffer.from(data, 'base64')
    };
    s3.putObject(params, callback);
}

function deleteImage(path, filename, callback) {
    const params = {
        'Bucket':'beritamus',
        'Key': path + "/" + filename,
    };
    s3.deleteObject(params, callback);
}