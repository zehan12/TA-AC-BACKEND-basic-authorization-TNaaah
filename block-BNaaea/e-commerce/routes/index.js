var express = require('express');
var router = express.Router();
var User = require('../models/User')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get( '/dashboard', async ( req, res, next ) => {
  res.locals.message = req.flash('success')[0];
  var message = res.locals.message;
  
  try {
    const user = await User.findById(req.session.userId);
    var { name } = user;
    res.render('dashboard',{message,name});
  } catch (err) {
    return next(err);
  }
} )

module.exports = router;
