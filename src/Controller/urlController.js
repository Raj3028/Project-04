//=====================Importing Module and Packages=====================//
const urlModel = require('../models/urlModel')
const shortid = require('shortid')
const axios = require('axios')
const { GET_ASYNC, SET_ASYNC } = require('../Redis/redis')


//<<<================================= All functions are for Validation ===================================>>>//

//===================== Checking that there is something as Input =====================//
const checkInputsPresent = (value) => { return (Object.keys(value).length > 0); }

//===================== Validating the Input =====================//
const checkString = function (value) {
    if (typeof value == "number" || typeof value == "undefined" || value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}
//<<<=====================================================================================================>>>//




//<<<=====================This function is used for Create Shorten URL=====================>>>//

const urlShorter = async (req, res) => {
    try {

        let originalURL = req.body

        //===================== Destructuring URL Body Data =====================//
        let { longUrl, ...rest } = originalURL

        //===================== Checking Mandotory Field =====================//
        if (!checkInputsPresent(originalURL)) return res.status(400).send({ status: false, message: "No data found from Body!" });
        if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only longUrl." }) }

        //===================== Validation of URL =====================//
        if (!checkString(longUrl)) { return res.status(400).send({ status: false, message: 'Please Provide Valid longUrl.' }) }


        //===================== Fetch the URL data from Redis Server(Remote Dictionary Server) =====================//
        let cacheURLData = await GET_ASYNC(`${longUrl}`)

        //===================== Checking URL data is Present or Not in Redis Server =====================//
        if (cacheURLData) {

            //===================== Parse JSON String into JS Object =====================//
            cacheURLData = JSON.parse(cacheURLData)

            let cacheURLDataObj = {
                longUrl: cacheURLData.longUrl,
                shortUrl: cacheURLData.shortUrl,
                urlCode: cacheURLData.urlCode
            }

            return res.status(200).send({ status: true, message: `This URL is Already Present in Cache! So use this shortURL: ${cacheURLData.shortUrl}`, data: cacheURLDataObj })
        }

        //===================== Checking the requested URL is Valid or Not by AXIOS =====================//
        let option = {
            method: 'get',
            url: longUrl
        }
        let urlValidate = await axios(option)
            .then(() => longUrl)    /*Pending and Fulfilled Promise Handling.*/
            .catch(() => null)      /*Reject Promise Handling*/

        if (!urlValidate) { return res.status(400).send({ status: false, message: `This Link: ${longUrl} is not Valid URL.` }) }


        //x=====================Fetching URL Data from DB and Checking Duplicate urlCode & shortUrl are Present or Not=====================x//
        let isPresent = await urlModel.findOne({ longUrl: longUrl })

        if (isPresent) {
            //x===================== Convert JS Object to JSON String then Store or Set URL data in Redis Server =====================x//
            await SET_ASYNC(`${longUrl}`, 24 * 60 * 60, JSON.stringify(isPresent))

            let isPresentObj = {
                longUrl: isPresent.longUrl,
                shortUrl: isPresent.shortUrl,
                urlCode: isPresent.urlCode
            }

            return res.status(200).send({ status: true, message: `For This LongUrl use this ShortUrl: ${isPresent.shortUrl} which is already Registered in DB`, data: isPresentObj })
        }

        //x===================== Create Shorten URL =====================x//
        let baseURl = "http://localhost:3000/"
        originalURL.urlCode = shortid.generate().toLowerCase()
        originalURL.shortUrl = baseURl + originalURL.urlCode

        //x===================== Creating URL Document inside DB =====================x//
        let createURL = await urlModel.create(originalURL)

        //===================== Response =====================//
        res.status(201).send({ status: true, data: originalURL })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }
}



//<<<===================== This function is used Fetch the URL Data from DB =====================>>>//

const redirectURL = async (req, res) => {
    try {

        let urlCode = req.params.urlCode

        //===================== Fetch the URL data from Redis Server(Remote Dictionary Server) =====================//
        let cacheURLData = await GET_ASYNC(`${urlCode}`)

        //===================== Checking URL data is Present or Not in Redis Server =====================//
        if (cacheURLData) {
            //===================== Parse JSON String into JS Object =====================//
            cacheURLData = JSON.parse(cacheURLData)

            return res.status(302).redirect(cacheURLData.longUrl)

        } else {
            //x===================== Fetch the URL Data from DB =====================x//
            let urlDetails = await urlModel.findOne({ urlCode: urlCode }).select({ _id: 0, longUrl: 1 })
            if (!urlDetails) { return res.status(404).send({ status: false, message: `This URLCode: ${urlCode} is not found!` }) }

            //x===================== Convert JS Object to JSON String then Store or Set URL data in Redis Server =====================x//
            await SET_ASYNC(`${urlCode}`, 24 * 60 * 60, JSON.stringify(urlDetails))

            //x===================== Redirect the response to the URL =====================x//
            res.status(302).redirect(urlDetails.longUrl)
        }

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }
}




//=====================Module Export=====================//
module.exports = { urlShorter, redirectURL }