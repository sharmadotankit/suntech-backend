const { S3Client } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");

const s3Client = new S3Client({
  region: 'ap-south-1',
  credentials: fromEnv(), 
});

module.exports = {
  s3Client,
  fromEnv
};
