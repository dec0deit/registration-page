const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport')
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../config/auth')
router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register');
})
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    let errors = [];
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                //alert('email exists');
                res.render('/register');
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;

                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(newUser);
                                res.render('dashboard', { name })
                            }
                        })
                    })
                })
            }
        }).catch((err) => {
            console.log(err);
        })

})
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log(req.query.name)
    res.render('dashboard', { name: req.user.name });
})
router.post('/login', (req, res, next) => {
    console.log('running');
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/login',

    })(req, res, next);
})
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/user/login');
})
module.exports = router;
