import dotenv from "dotenv";
dotenv.config();

const AWS=require('aws-sdk');

AWS.config.update({region:process.env.REGION,
    accessKeyId:process.env.ACCESS_KEY,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});

const s3= new AWS.S3();

const S3_BUCKET=process.env.BUCKET_NAME;

module.exports={s3,S3_BUCKET};

