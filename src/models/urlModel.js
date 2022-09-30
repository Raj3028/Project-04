//=====================Importing Mongoose Package=====================//
const mongoose = require('mongoose')


//=====================Creating URL's Schema=====================//
const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    longUrl: {
        type: String,
        require: true
    },
    shortUrl: {
        type: String,
        require: true,
        unique: true
    }

}, { timestamps: true })


//=====================Module Export=====================//
module.exports = mongoose.model('url', urlSchema)