const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PhotoSchema = new Schema({
    title:String,
    description:String,
    image:String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Photo = mongoose.model('photos', PhotoSchema);
module.exports = Photo;
