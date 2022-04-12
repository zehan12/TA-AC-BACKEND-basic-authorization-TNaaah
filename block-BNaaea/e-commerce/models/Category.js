var mongoose = require("mongoose");
const Product = require("./Product");
var Schema = mongoose.Schema;

var categorySchema = new Schema ({
    name: { type: String, lowercase: true },
    productId: [ {
        type: Schema.Types.ObjectId,
        ref: "Product",
    } ]
})

module.exports = categorySchema;