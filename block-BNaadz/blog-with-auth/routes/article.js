var Article = require("../models/Article");
var Comment = require("../models/Comment");
var mongoose = require('mongoose');


var router = require('express').Router();



router.get( '/', ( req, res )=>{
    Article.find( {}, ( err, article ) => {
        if ( err ) return next( err );
        res.render( "allArticle", { article } );
    } );
} );

router.get('/new', ( req, res, next )=>{
    res.render("article/new");
})

router.get('/form', ( req, res, next )=>{
    res.render("p1/articleForm");
})

//! getting data from article form
router.post('/form', ( req, res, next )=>{
    console.log(req.body)
    Article.create( req.body, ( err, article )=>{
        if ( err ) return next( err );
        res.redirect("/article/allArticle");
    } );
});

//! all article 
router.get('/allArticle', ( req, res, next )=>{
    Article.find( {}, ( err, article )=>{
        if ( err ) return next( err );
        res.render("p1/allArticle",{article})
    } )
})

router.get('/index', async (req,res,next)=>{
    try {
        const article = await Article.find( {  } );
        res.render( 'article/index', { article } );
    } catch ( err ) {
        return next( err );
    }
} );

//! detailed article
// router.get('/:slug/detail', ( req, res, next )=>{
//     var slug = req.params.slug;
//     console.log(slug)
//     Article.findOne({slug: slug}).populate('Comments').exec((err,article)=>{
//         if (err) return next( err );
//         res.render( "p1/detailedArticle", {article} )
//     })
// })

router.get( '/:slug/detail', async ( req, res, next )=>{
    var slug = req.params.slug;
    Article.findOne({slug: slug}).populate('Comments').exec((err,article)=>{
        if (err) return next( err );
        res.render( "article/show", {article} )
    })
} )

//! delete article 
router.get( '/:slug/delete', async ( req, res, next )=>{
    var slug = req.params.slug;
    try{
        const article = await Article.findOneAndDelete( { slug: slug } );
        const { _id } = await article;
        const deleteArticle = await Comment.deleteMany( { articleId: _id } );
        res.redirect("/article/allArticle");
    } catch ( err ) {
        return next( err );
    }
} );

//! edit article on get
router.get( '/:slug/edit', async ( req, res, next )=>{
    var slug = req.params.slug;
    try {
        const articleFindBySlug = await Article.findOne( { slug: slug } );
        console.log(articleFindBySlug);
        res.render( "editArticle", { article: articleFindBySlug } );
    } catch ( err ) {
        return next( err );
    }
} );

//! edit article on post 
router.post( '/:slug/edit', async( req, res, next )=>{
    var slug = req.params.slug;
    console.log(req.body);
    try {
        const articleUpdate = await Article.findOneAndUpdate( { slug: slug }, req.body );
        res.redirect('/article/'+slug+"/detail");
    } catch ( err ) {
        return next ( err );
    }
} );

//! likes
router.get( '/:slug/like', async( req, res, next )=>{
    var slug = req.params.slug;
    try {
        const articleLikes = await Article.findOneAndUpdate( { slug: slug },  {$inc: {likes: 1}}  );
        res.redirect('/article/'+slug+'/detail');
    } catch (err){
        return next(err);
    }
} )

//! dislike
router.get( '/:slug/dislike', ( req, res, next )=>{
    var slug = req.params.slug;
    var dislike = req.body.likes
    Article.findOne( {slug:slug}, ( err, articles )=>{
        if ( err ) return next(err);
        if ( articles.likes === 0 ){
            Article.findOneAndUpdate( {slug:slug}, { likes: 0 }, (err,articles)=>{
                if ( err ) return next(err);
                res.redirect('/article/'+slug+'/detail');
            } )
        } else {
        Article.findOneAndUpdate( {slug:slug}, {$inc: {likes: -1}}, (err,articles)=>{
            if (err) return next(err);
            res.redirect('/article/'+slug+'/detail');
            } );
        }
    } );
});

module.exports = router;