const express = require('express');
//npm install --save bcrypt    
const bcrypt = require('bcrypt');
//npm install --save jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                            message: "Invalid auth creds"
                    });
                });
        });
});

router.post("/login", (req, res, next) => {
    console.log("Inside user.js in routes");
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed - User not found"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password) //returns a promise
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed - Password mismatch"
                });
            }
            //Send Json Web Token
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'secret_secret',
                { expiresIn: '1h' });
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                message: 'Login successful'
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed - Some other error"
            });
        });
});

module.exports = router;