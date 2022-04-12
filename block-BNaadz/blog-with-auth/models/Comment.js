var mongoose = require("mongoose");
const Article = require("./Article");
var Schema = mongoose.Schema;

var commentsSchema = new Schema( {
    content : { type: String, required: true },
    articleId : { type: Schema.Types.ObjectId, ref: Article, required: true }
}, { timestamps: true } );

module.exports = mongoose.model( "Comment", commentsSchema );