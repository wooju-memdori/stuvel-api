const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.accessKeyID,
  secretAccessKey: process.env.secretAccessKey,
  region: 'ap-northeast-2',
});

const s3 = new aws.S3();

module.exports = multer({
  storage: multerS3({
    s3,
    bucket: 'stuvelimg',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `img/${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1000 * 1000 * 10,
  },
});
