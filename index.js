require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session')
const app = express();
const passport = require('./config/ppConfig')

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(ejsLayouts);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
//come after session setup
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;

