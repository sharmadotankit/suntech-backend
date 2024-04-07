const express = require('express');
const router = express.Router();
const adminController= require('../controllers/adminController')
const authMiddleWare = require('../middlewares/auth');
const multer = require('multer');
const awsConfig = require('../aws-config');
const s3Storage = require('multer-s3');

const storage = new s3Storage({
    s3: awsConfig,
    bucket: process.env.BUCKET_NAME,
    contentType: multer.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/company-data/:companyName', authMiddleWare.checkIfValidUser,adminController.getCompanyData)
router.put('/update-company', authMiddleWare.checkIfAdmin, adminController.updateCompany)
router.get('/client-code', authMiddleWare.checkIfAdmin, adminController.getClientCodeForNewClient)
router.post('/create-update-client', authMiddleWare.checkIfAdmin,upload.any('clientDocuments'), adminController.createUpdateClient)


module.exports = router;