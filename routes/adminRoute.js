const express = require('express');
const router = express.Router();
const adminController= require('../controllers/adminController')
const authMiddleWare = require('../middlewares/auth');
const { S3Client } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-providers');
const multerS3 = require('multer-s3');
const multer = require("multer");

const s3 = new S3Client({
    region: 'ap-south-1',
    credentials: fromEnv(), 
  });


  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      // acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, '/'+Date.now().toString() + '-' + file.originalname);
      }
    })
  });

router.get('/company-data/:companyName', authMiddleWare.checkIfValidUser,adminController.getCompanyData)
router.put('/update-company', authMiddleWare.checkIfAdmin, adminController.updateCompany)
router.get('/client-code', authMiddleWare.checkIfAdmin, adminController.getClientCodeForNewClient)
router.post('/create-update-client', authMiddleWare.checkIfAdmin,upload.array("clientDocuments"), adminController.createUpdateClient)
router.get('/clients/:companyId', authMiddleWare.checkIfValidUser,adminController.fetchClientsForCompany)

module.exports = router;