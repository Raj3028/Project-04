const urlSchema = require('../models/urlModel')
const shortid = require('shortid')
const validURL = require('valid-url')
const axios = require('axios')


const createURL = async (req, res) => {

    try {

        let originalURL = req.body.longUrl

        if (!validURL.isUri(originalURL)) { return res.status(400).send({ status: false, message: ` This ${originalURL} is not Valid.` }) }

        if (!originalURL) { return res.status(400).send({ status: false, message: ' Please Provide longUrl.' }) }


        let option = {
            method: 'get',
            url: originalURL
        }

        // let result = await axios(option)
        //     .then(() => originalURL)
        //     .catch(() => null)

        // if (!result) { return res.status(400).send({ status: false, message: 'Original URL is not  Exist.' }) }

        let isPresent = await urlSchema.findOne({ longUrl: originalURL }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })
        if (isPresent) {
            return res.status(200).send({ status: true, message: 'Short URL is already Generated.', data: isPresent })
        }

        let baseURl = "http://localhost:3000/"
        let shortURL = shortid.generate()
        let URL = baseURl + shortURL

        let object = {
            longUrl: originalURL,
            shortUrl: URL,
            urlCode: shortURL
        }

        let createURL = await urlSchema.create(object)
        res.status(201).send({ status: true, data: object })


    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }

}

module.exports = createURL