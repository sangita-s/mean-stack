const express = require('express');
//npm install --save bcrypt    
const bcrypt = require('bcrypt');
//npm install --save jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const UserController = require("../controllers/user");

const router = express.Router();

//Just passing a reference, not executing it. 
router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

module.exports = router;