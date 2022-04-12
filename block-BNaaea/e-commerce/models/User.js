var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

require('dotenv').config();
console.log(process.env.SECRET);

var userSchema = new Schema( {
    name : String,
    email: { type: String, unique: true, required: true },
    password: String,
    likeId: [ { type: Schema.Types.ObjectId , ref:"Product" } ],
    isAdmin: Boolean,
}, { timestamps: true } );


userSchema.post('save', function (doc) {
    console.log('this fired after a document was saved');
});

userSchema.post('find', function(docs) {
    console.log('this fired after you ran a find query');
});

userSchema.post(/Many$/, (res)=> {
    console.log('this fired after you ran `updateMany()` or `deleteMany()`');
});



// m.find(function(err, docs) {
//     console.log('this fires after the post find hook');
// });

userSchema.pre( 'save', function( next ) {
    if ( this.password && this.isModified( "password" ) ) {
        bcrypt.hash( this.password, 10, ( err, hashed ) => {
            if ( err ) return next( err );
            this.password = hashed;
            next();
        })
    } else {
        next();
    }
} );

// userSchema.post( 'save', function( next ) {
//     console.log(this);
//     var user = this;
//     console.log(user.SECRET,"user");
//     console.log(this.SECRET,"this");
//     if ( this.SECRET === "iAmFuckingAdmin" ) {
//         this.isAdmin = true;
//         next();
//     } else {
//         next();
//     }
// } )

userSchema.methods.verifyPassword = function( password, cb ) {
    bcrypt.compare( password, this.password, ( err, result ) => {
        return cb( err, result )
    } )
}

// userSchema.method.isAdmin = function( req, res, cb ){
//     req.body.isAdmin = "false";
//     console.log(req.body.isAdmin);
//     if ( req.body.SECRET === process.env.secretCode ) {
//         req.body.isAdmin = "true";
//         console.log("TRUE")
//         cb( req, res );
//         next();
//     } else {
//         cb ( req, res );
//         console.log("False")
//         next();
//     }
// }

module.exports = mongoose.model( "User", userSchema );