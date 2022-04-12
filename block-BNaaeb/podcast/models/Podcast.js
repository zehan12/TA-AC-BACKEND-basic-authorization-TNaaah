var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var podcastSchema = new Schema( {
    title: {
        type: String,
        unique: true
    },
    img: String,
    
} )