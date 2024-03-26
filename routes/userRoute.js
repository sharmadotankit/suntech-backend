const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController')


router.get('/company-date/:companyName', userController.getCompanyData)


module.exports = router;