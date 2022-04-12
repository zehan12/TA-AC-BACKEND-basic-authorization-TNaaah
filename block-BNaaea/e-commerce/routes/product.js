var express = require("express");
var router = express.Router();

var Product = require('../models/Product');
var User = require('../models/User');

const multer  = require('multer')
const path = require('path');
var uploadPath = path.join( __dirname, '../', 'public/uploads' );

var auth = require( '../middlewares/auth' );

//! custom multer disk storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb( null, uploadPath );
    },
    filename: function (req, file, cb) {
    console.log(file);
    //* it will create a random suffix for image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname )
    }
})

const upload = multer({ storage: storage })

//! it will show all product on index route
router.get( '/index', async ( req, res, next ) => {
    try {
        var product = await Product.find( {  } );
        console.log(req.session.userId);
        var user = await User.findById(req.session.userId);
        res.render( 'product/index', { product, user } );
    } catch ( err ) {
        return next( err );
    } 
} );

//! it will render to form page threw new route
router.get( '/new', ( req, res, next ) => {
    res.render( 'product/new' );
} );

//! it will take all form data new post route
router.post( '/new', auth.loggedInUser, upload.single('image'), async ( req, res, next ) => {
    req.body.image = req.file.filename;
    // console.log(req.body[image],"body");
    try {
        // const findCategory = await Category.findOne( { name: req.body.category } );
        // if ( req.body.category ) {
            const product = await Product.create( req.body );
            //! push category id into the product: category id;
            console.log(product,"product");
            res.redirect( '/product/index');
        // } else {
            // const createCategory = await Category.create( req.body.category );
            // const product = await Product.create( req.body );
            // //! push both id to each other;
            // console.log(product,"product");
            // res.redirect( '/product/index');
        // }
    } catch ( err ) {
        return next( err );
    }
} );

router.get( '/:slug/show', async ( req, res, next ) => {
    var slug = req.params.slug;
    try{
        const product = await Product.findOne({slug:slug});
        res.render( 'product/show', { product } );
    } catch ( err ) {
        return next( err );
    }
} )

router.get( '/:slug/edit', async ( req, res, next ) => {
    var slug = req.params.slug;
    try {
        const product = await Product.findOne( { slug: slug } );
        res.render( 'product/edit', {product} );
    } catch ( err ) {
        return next( err );
    }
} )

router.post( '/:slug/edit', async ( req, res, next ) => {
    var slug = req.params.slug;
    console.log(req.body);
    console.log(req.body,"before up")
    try {
        const product = await Product.findOneAndUpdate( { slug: slug }, req.body, { new: true } );
        res.redirect( '/product/'+ slug +'/show' );
    } catch ( err ) {
        return next( err );
    }
} );


router.get( '/:slug/delete', async( req, res, next ) => {
    var slug = req.params.slug;
    try {
        const deletedProduct = await Product.findOneAndDelete( { slug: slug } );
        res.redirect( '/product/index' );
    } catch ( err ) {
        return next( err );
    }
} );

//! like by single user for once
router.get( '/:slug/like', auth.loggedInUser, async( req, res, next ) => {
    var slug = req.params.slug;
    try {
        const productLiked = await Product.findOne( { slug: slug } );
            if ( productLiked.likeId.includes( req.session.userId ) ) { 
                // promise.all;
                const dislikeProduct = await Product.findOneAndUpdate( { slug: slug }, { $inc: { likes: -1 } }, { new: true}  );
                const removeId = await Product.findOneAndUpdate( { slug: slug }, { $pull: { likeId: req.session.userId } } );
                const removeUserLikeId = await User.findOneAndUpdate( { slug: slug }, { $pull: { likeId: id } } );
                res.redirect( '/product/'+slug+'/show' );
            } else {
                    const productForLike = await Product.findOne( { slug: slug } );
                    var like = productLiked.likes;
                    var counter = like === 'likes' ? 1 : +1;
                    const productIncLike = await Product.findOneAndUpdate( { slug: slug }, { $inc: {likes: counter} } );
                    const productLikeId = await Product.findOneAndUpdate( { slug: slug },  { $push : { likeId: req.session.userId } } );
                    var { _id } = productLikeId;
                    const userPushLikeId = await User.findByIdAndUpdate( req.session.userId, { $push: { likeId: _id } } );
                    res.redirect( '/product/'+slug+'/show' );
            }
        });
    } catch ( err ) {
        return next( err );
    }
} );

module.exports = router;