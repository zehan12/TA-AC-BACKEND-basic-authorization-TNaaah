var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash');


mongoose.connect( 'mongodb://localhost/e-commerce', ( err )=>{
    console.log( err ? err : "connected to database" );
} );

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var auth = require('./middlewares/auth');

require('dotenv').config();
console.log(process.env.SECRET);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));


//   app.use((req, res, next) => { // color code the message type
//     res.locals.message = req.flash('success')
//     res.locals.message = req.flash('error')
//     next()
// })

// app.use( ( err, req, res, type ) => {
//     console.log( err.stack );
//     res.type( 'text/plain' );
//     res.status( 500 );
//     res.send( 'internal server error 500' )
// } )

app.use( auth.userInfo );

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);

module.exports = app;
