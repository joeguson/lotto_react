//url - '/api/image'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const config =require('../config.json');
const AWS = require('aws-sdk');
const imageThumbnail = require('image-thumbnail');
const s3 = new AWS.S3(config.aws_config);
/* ===== image ===== */
let options = { percentage: 50};

route.delete('/', (req, res) => {
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

route.post('/', (req, res) => {
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
    imageThumbnail(data, options).then((thumbnail) => {
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

module.exports = route;