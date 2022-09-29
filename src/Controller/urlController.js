const urlSchema = require('../models/urlModel')
const shortid = require('shortid')
const validURL = require('valid-url')


const createURL = async (req, res) => {

    try {

        let originalURL = req.body.longUrl

        if (!originalURL) { return res.status(400).send({ status: false, message: ' Please Provide longUrl.' }) }

        let option = {
            method: 'get',
            url: originalURL
        }



    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }


}