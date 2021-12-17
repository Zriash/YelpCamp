const express = require('express');
const router = express.Router();
const users = require('../controlers/users');
const passport = require('passport');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.createNewUser)

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local',
        {failureFlash: true, failureRedirect: '/login'}),
            users.loginUser)

router.get('/logout', users.logoutUser);


module.exports = router;