var express = require('express');
var router = express.Router();
var User = require('../models/User');

require('dotenv').config();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get( '/register', ( req, res, next ) => {
  res.locals.message = req.flash('error')[0];
  var message = res.locals.message;
  res.render('user/register', {message:message});
} );

async function createUser( req, res, next ){
  req.body.isAdmin = false;
  var email = req.body.email;
  try {
  const user = await User.create( req.body );
    if ( user ) {
      if ( req.body.SECRET === process.env.SECRET ) {
        return isAdmin( email, res );
      } else {
        res.redirect( '/users/login' );
      }
    } 
  } catch ( err ) {
    return next( err );
  } 
}

function isAdmin( email, res ){
  User.findOneAndUpdate( { email: email }, { isAdmin: true }, ( err, up )=>{
    if ( err ) return next( err );
    res.redirect( '/users/login' );
  } );
}

router.post( '/register', ( req, res, next ) => {
  console.log(req.body);
  var { email, password } = req.body;
  console.log(req.body);
  if ( email ) {
    User.findOne( { email }, ( err, user ) => {
      if ( err ) return next( err );
      if ( !user ) {
        if ( password.length <= 4 ){
          req.flash( 'error', 'Password is Short' );
          return res.redirect( '/users/register' );
        }
        else if ( !email.includes("@") ) {
          req.flash( 'error', 'email is incorrect'  );
          return res.redirect( '/users/register' );
        }
        else {
          return createUser( req, res, next );
        }
      }
      else {
      req.flash( 'error', 'This email already registered & login here' );
      return res.redirect( '/users/login' );
      }
    } );
  } 
  else {
    req.flash( 'error', "Email required" );
    return res.redirect( '/users/register' );
  }
} );


router.get('/login', ( req, res, next )=>{
  res.locals.message = req.flash('error')[0];
  var message = res.locals.message;
  res.render("user/login", {message});
});

router.post( '/login', async ( req, res, next ) => {
  var { email, password } = req.body;
  try {
    if (!email || !password) {
      req.flash('error', 'Email/Password required');
      return res.redirect('users/login');
    }
    const user = await User.findOne({ email });
    //if no user 
    if(!user){
      req.flash( 'error', 'User Not Found!!!' )
      return res.redirect('/users/register');
    }
    // if user, compare password
    user.verifyPassword(password, (err, result)=>{
      if(err) return next(err);
      if(!result){
        req.flash( 'error', 'Password is incorrect' );
        return res.redirect('/users/login');
      }
      // persist loged in user information
      console.log("User Login");
      req.session.userId = user.id;
      console.log(user);
      console.log(req.session.userId);
      req.flash( 'success', "User Loged-In" );
      res.redirect( '/dashboard' );
    });
  } catch (err) {
    return next(err);
  }
} );

// logout
router.get( '/logout', ( req, res, next ) => {
  req.session.destroy();
  res.clearCookie( 'connect.sid' );
  console.log("User Logout");
  res.redirect( '/users/login' );
} );

module.exports = router;
