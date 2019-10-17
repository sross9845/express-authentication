const express = require('express');
const router = express.Router();
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
      res.redirect('/')
    } else {
      //if user existed error and redirect to sign up
      console.log('Email already exists')
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

module.exports = router;
