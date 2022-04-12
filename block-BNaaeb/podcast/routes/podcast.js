const { route } = require('.');

var router = require('express').Router();

router.get( '/index', ( req, res, next ) => {
    res.render( 'api/podcast/index' );
} )

router.get( '/:slug/show', ( req, res, next ) => {
    res.render( 'podcast/show' );
} )

router.get( '/:slug/new', ( req, res, next ) => {
    res.render( 'api/podcast/new' );
} );

router.post( '/:slug/new', ( req, res, next ) => {
    console.log( req.body );
} );

router.get( '/:slug/like', ( req, res, next ) => {
    res.redirect( '/api/podcast/' + slug + '/show' );
} );

router.get( '/:slug/dislike', ( req, res, next ) => {
    res.redirect( '/api/podcast/' + slug + '/dislike' );
} );

router.get( '/:slug/update', ( req, res, next ) => {
    res.redirect( 'api/podcast/update' );
} )

router.post( '/:slug/update', ( req, res, next ) => {
    console.log( req.body );
} )

router.get( '/:slug/delete', ( req, res, next ) => {
    res.redirect( '/api/podcast/indes' );
} )

module.exports = router;