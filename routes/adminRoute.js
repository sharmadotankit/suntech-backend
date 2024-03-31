const express = require('express');
const router = express.Router();
const adminController= require('../controllers/adminController')
const authMiddleWare = require('../middlewares/auth');


router.get('/company-data/:companyName', authMiddleWare.checkIfValidUser,adminController.getCompanyData)
router.put('/update-company', authMiddleWare.checkIfAdmin, adminController.updateCompany)


module.exports = router;