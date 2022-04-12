var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

var articleSchema = new Schema({
    title : { 
        type: String, 
        required: true 
    },
    description : String,
    likes : {
        type: Number,
        default: 0
    },
    Comments : [
        {
            type : Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
        slug: "title"
    }
}, {
    timestamps: true
}
);

articleSchema.pre("save", function(next) {
    this.slug = this.title.split(" ").join("-");
    next();
});


module.exports = mongoose.model( "Article", articleSchema );
