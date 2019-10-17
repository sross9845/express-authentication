const express = require('express');
const router = express.Router();
const passport = require('../config/ppconfig')
const db = require('../models');


router.get('/signup', function(req, res) {

  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  //find or create user
  db.user.findOrCreate({
    where:{
      email: req.body.email
    },
    defaults:{
      name: req.body.name,
      password: req.body.password
    }
  }).then(function([user, created]){
    if(created){
      //else sign user up through form and redirect to home
      console.log('User successfully created')
      passport.authenticate('local',{
        successRedirect: '/',
        successFlash: 'Account created and logged in!'
      })(req,res);
    } else {
      //if user existed error and redirect to sign up
      console.log('Email already exists')
      req.flash('error', 'Email already exists')
      res.redirect('/auth/signup')
    }
  }).catch(function(err){
    //catch errors
    console.log(err);
    res.redirect('/auth/signup');
  })
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'You have logged in',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid credentials!'
}))

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success', 'You have logged out!')
  res.redirect('/');
})

module.exports = router;
