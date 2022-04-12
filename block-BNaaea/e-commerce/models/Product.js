var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

var productSchema = new Schema( {
    name: { type: String, unique: true, required: true },
    quantity: { type: Number, default: 1 }, 
    price: { type: Number, required: true  },
    image: String,
    likes: { type: Number, default: 0 },
    likeId: [ { type:Schema.ObjectId, ref:'User' } ],
    slug: { type: String, slug: this.name, unique: true },
    category: String,
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true } );

productSchema.pre("save", function(next) {
    this.slug = this.name.split(" ").join("-");
    next();
});

module.exports = mongoose.model( 'Product', productSchema );