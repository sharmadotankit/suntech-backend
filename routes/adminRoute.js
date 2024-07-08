const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const authMiddleWare = require('../middlewares/auth');
const {S3Client} = require('@aws-sdk/client-s3');
const {fromEnv} = require('@aws-sdk/credential-providers');
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
            cb(null, '/' + Date.now().toString() + '-' + file.originalname);
        }
    })
});

router.get('/company-data/:companyName', authMiddleWare.checkIfValidUser, adminController.getCompanyData)
router.put('/update-company', authMiddleWare.checkIfAdmin, adminController.updateCompany)
router.get('/client-code', authMiddleWare.checkIfAdmin, adminController.getClientCodeForNewClient)
router.post('/create-update-client', authMiddleWare.checkIfAdmin, upload.array("clientDocuments"), adminController.createUpdateClient)
router.get('/clients', authMiddleWare.checkIfValidUser, adminController.fetchClientsForCompany)
router.get('/client/:clientId', authMiddleWare.checkIfAdmin, adminController.getClientById)
router.get('/offer-code/:companyId', authMiddleWare.checkIfAdmin, adminController.getOfferCodeForNewOffer)
router.post('/create-update-offer', authMiddleWare.checkIfAdmin, adminController.createUpdateOffer)
router.get('/offers', authMiddleWare.checkIfValidUser, adminController.fetchOfferForCompany)
router.get('/offer/:offerId', authMiddleWare.checkIfAdmin, adminController.getOfferById)
router.post('/create-update-project', authMiddleWare.checkIfAdmin, upload.array("attachedDocumentFile"), adminController.createUpdateProject)
router.get('/projects', authMiddleWare.checkIfValidUser, adminController.fetchProjectsForCompany)
router.get('/project/:projectId', authMiddleWare.checkIfAdmin, adminController.getProjectById)
router.get('/project-filters', authMiddleWare.checkIfAdmin, adminController.getProjectFilters)
router.get('/invoice-filters', authMiddleWare.checkIfAdmin, adminController.getInvoiceFilters)
router.post('/create-update-invoice', authMiddleWare.checkIfAdmin,upload.any(), adminController.createUpdateInvoice)
router.post('/save-site-visit', authMiddleWare.checkIfAdmin,upload.any(), adminController.createUpdateSiteVisit)
router.get('/site-visits', authMiddleWare.checkIfAdmin, adminController.fetchSiteVisitsForCompany)
router.get('/site-visit/:siteVisitId', authMiddleWare.checkIfAdmin, adminController.getSiteVisitById)
router.get('/site-visit-filter', authMiddleWare.checkIfAdmin, adminController.getSiteVisitFilters)
router.get('/outward-filter', authMiddleWare.checkIfAdmin, adminController.getOutwardFilters)
router.get('/outwards', authMiddleWare.checkIfAdmin, adminController.fetchOutwardsForCompany)
router.post('/create-update-outward', authMiddleWare.checkIfAdmin,upload.any(), adminController.createUpdateOutward)
router.get('/invoice/:invoiceId', authMiddleWare.checkIfAdmin, adminController.getInvoiceById)
router.get('/invoice', authMiddleWare.checkIfAdmin, adminController.fetchInvoiceForCompany)
router.get('/invoice-letter/:invoiceId', authMiddleWare.checkIfAdmin, adminController.fetchInvoiceLetterByInvoiceId)
router.post('/create-update-invoice-letter',authMiddleWare.checkIfAdmin, adminController.createUpdateInvoiceLetter)




module.exports = router;