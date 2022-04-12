const User = require("../models/User");

module.exports = {
    loggedInUser: ( req, res, next ) => {
        if ( req.session && req.session.userId ) {
            next(  );
        } else {
            res.redirect("/users/login");
        }
    },

    userInfo: ( req, res, next ) => {
        var userId = req.session && req.session.userId;
        if ( userId ) {
            User.findById( userId, "name email", ( err, user ) => {
                if ( err ) return next( err );
                req.user = user;
                res.locals.user = user;
                next();
            } )
        } else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    },

    isAdmin: async ( req, res, next ) => {
        try {
            if ( req.session && req.session.userId ) {
                const user = await User.findById( req.session.userId );
                if ( user.isAdmin ) {
                    next();
                } else {
                    res.redirect( "/dashboard" );
                }
            }
        } catch ( err ) {
            return next( err );
        }
    }    
}