
const AWS=require('aws-sdk');

AWS.config.update({region:"ap-south-1",
    accessKeyId:"AKIAXDP3VEDIGI6PML5S",
    secretAccessKey:"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"
});

const s3= new AWS.S3();

const S3_BUCKET="simpledemouserbucket";

module.exports={s3,S3_BUCKET};

