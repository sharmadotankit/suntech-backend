const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const checkIfValidUser = require('../middlewares/auth').checkIfValidUser;

router.post('/create-user',checkIfValidUser,authController.createUser);
router.get('/users',checkIfValidUser,authController.getUsers);
router.post('/login',authController.login);


module.exports = router;