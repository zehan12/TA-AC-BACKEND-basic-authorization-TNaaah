var express = require('express');
var router = express.Router( {mergeParams:true} );
var Article = require("../models/Article");
var Comment = require("../models/Comment");

/* GET home page. */
//! create commment
router.post('/new', function(req, res, next) {
    var slug = req.params.articleSlug; 
    Article.findOne( { slug: slug }, ( err, article )=>{
        if ( err ) return next(err);
        req.body.articleId = article.id;
        Comment.create( req.body, ( err, comment )=>{
            if ( err ) return next( err );
            Article.findByIdAndUpdate( article.id, { $push: { Comments: comment._id } }, ( err, article )=>{
                if ( err ) next( err );
                res.redirect( "/article/"+article.slug+"/detail" );
            })
        } )
    } )
});

//! delete one comment
router.get( '/:commentId/delete', async( req, res, next )=>{
    var id = req.params.commentId;
    var slug = req.params.articleSlug;
    console.log(req.params);
    try {
        const commentDelete = await Comment.findByIdAndDelete( id );
        var { articleId } = commentDelete;
        const removeCommentId = await Article.findByIdAndUpdate(  articleId, { $pull: { Comments: id } } );
        res.redirect('/article/'+slug+'/detail');
    } catch (err){
        return next(err);
    }; 
} );

//! edit comment on get
router.get( '/:commentId/edit', async( req, res, next )=>{
    var id = req.params.commentId;
    var slug = req.params.articleSlug;
    try {
        const comment = await Comment.findById( id );
        res.render( "editComment", { comment, slug }  );
    } catch ( err ) {
        return next( err );
    }
} );

//! edit comment on post
router.post( '/:commentId/edit', async( req, res, next )=>{
    var id = req.params.commentId;
    var slug = req.params.articleSlug;
    var comment = req.body.content.trim();
    console.log(req.body,slug,id,comment);
    try {
        const commentEdit = await Comment.findByIdAndUpdate( id, { content: comment } );
        res.redirect(`/article/`+slug+`/detail`);
    } catch ( err ) {
        return next( err );
    }
} );

//! like

// router.get('/:slug/')

module.exports = router;
