require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session')
const app = express();
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const helmet = require('helmet')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const RateLimit = require('express-rate-limit');

app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(ejsLayouts);
app.use(helmet());

//rate limiters for log in or set up
const loginLimiter = new RateLimit({
  //ms in the form of 5 minutes
  windowMs: 1000 * 60 * 5,
  max: 3,
  message: 'Maximum login attempts exceeded, please try again later.'
})

const signupLimiter = new RateLimit({
  //ms in the form of 60 minutes
  windowMs: 1000 * 60 * 60,
  max: 3,
  message: 'Maximum accounts created, please try again later.'
})
// apply rate limiters to routers comment out when testing
// app.use('/auth/login', loginLimiter);
// app.use('/auth/signup', signupLimiter)

//store sessions in the database
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  //ms in the form of 30 minutes
  expiration: 1000 * 60 * 30,
});

//use this line once to set up the store table
sessionStore.sync();

//sessions must come before flash and passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

//must come after session and before passport middleware 
app.use(flash())
//come after session setup
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;

