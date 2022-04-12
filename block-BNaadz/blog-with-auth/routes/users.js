var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', ( req, res, next )=>{
  res.render("user/register");
})

async function createUser( req, res, next ){
  try {
    const user = await User.create( req.body );
    if ( user ) {
      res.redirect( '/users/login' );
    }
  } catch ( error ){
    return next(error);
  }
}

router.post( '/register', async( req, res, next ) => {
  console.log(req.body);
  var { email, password, age, phone } = req.body;

  if ( email ) {
  try{
      const user = await User.findOne( { email })
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
          return createUser( req, res );
          }
      }
      else {
      req.flash( 'error', 'This email already registered & login here' );
      return res.redirect( '/users/login' );
      }
  } catch (error){
      return next( error );
  }
}
  else {
    req.flash( 'error', "Email required" );
    return res.redirect( '/users/register' );
  }
} );

router.get('/login', ( req, res, next )=>{
  res.render("user/login");
});


router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.redirect('users/login');
    }
    const user = await User.findOne({ email });
    //if no user 
    if(!user){
      return res.redirect('/users/login');
    }
    // if user, compare password
    user.verifyPassword(password, (err, result)=>{
      if(err) return next(err);
      if(!result){
        return res.redirect('/users/login');
      }
      // persist loged in user information
      req.session.userId = user.id;
      res.redirect('/users');
    });
  } catch (err) {
    return next(err);
  }
});

router.get( '/logout', ( req, res, next ) => {
  req.session.destroy();
  res.clearCookie( 'connect.sid' );
  res.redirect( '/users/login' );
} );

module.exports = router;
