const express = require('express');
const router = express.Router();
const passport = require('passport');
// const { route } = require('.');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res ) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));
// el metodo islogged in verifica que el usuario esta logeado para proteger las rutas
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
});


router.get('/signin', isNotLoggedIn, (req, res ) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next ) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: 'signin',
        failureFlash: true
    })(req, res, next );
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});



module.exports = router;