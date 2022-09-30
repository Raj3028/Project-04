//=====================Importing Module and Packages=====================//
const urlModel = require('../models/urlModel')
const shortid = require('shortid')
const axios = require('axios')


//<<<=================================All functions are for Validation===================================>>>//

//===================== Checking that there is something as Input =====================//
const checkInputsPresent = (value) => { return (Object.keys(value).length > 0); }

//===================== Validating that the Input =====================//
const checkString = function (value) {
    if (typeof value == "number" || typeof value == "undefined" || value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}
//<<<=====================================================================================================>>>//


//<<<=====================This function is used for Create Shorten URL=====================>>>//

const createURL = async (req, res) => {
    try {

        let originalURL = req.body

        //=====================Destructuring Book Body Data =====================//
        let { longUrl, ...rest } = originalURL

        //=====================Checking Mandotory Field=====================//
        if (!checkInputsPresent(originalURL)) return res.status(400).send({ status: false, message: "No data found from Body!" });
        if (checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "You can input only longUrl." }) }

        //=====================Validation of URL=====================//
        if (!checkString(longUrl)) { return res.status(400).send({ status: false, message: 'Please Provide Valid longUrl.' }) }

        let option = {
            method: 'get',
            url: longUrl
        }
        let urlValidate = await axios(option)
            .then(() => longUrl)    /*Pending and Fulfilled Promise Handling.*/
            .catch(() => null)      /*Reject Promise Handling*/

        if (!urlValidate) { return res.status(400).send({ status: false, message: `This Link: ${longUrl} is not Valid URL.` }) }

        //=====================Fetching URL Data from DB and Checking Duplicate urlCode & shortUrl are Present or Not=====================//
        let isPresent = await urlModel.findOne({ longUrl: longUrl }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })
        if (isPresent) {
            return res.status(200).send({ status: true, message: 'Short URL is already Generated Before.', data: isPresent })
        }

        //x===================== Create Shorten URL =====================x//
        let baseURl = "http://localhost:3000/"
        let urlCode = shortid.generate().toLowerCase()
        let shortURL = baseURl + urlCode

        //x===================== Create Object For response =====================x//
        let object = {
            longUrl: longUrl,
            shortUrl: shortURL,
            urlCode: urlCode
        }

        //x=====================Final Creation of Book=====================x//
        let createURL = await urlModel.create(object)

        res.status(201).send({ status: true, data: object })

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }
}

//<<<=====================This function is used Fetch the URL Data from DB=====================>>>//

const redirectURL = async (req, res) => {
    try {

        let urlCode = req.params.urlCode

        //x===================== Fetch the URL Data from DB =====================x//
        let urlDetails = await urlModel.findOne({ urlCode: urlCode })
        if (!urlDetails) return res.status(400).send({ status: false, message: "URL not found" })

        //x===================== Redirect the response to the URL =====================x//
        res.status(302).redirect(urlDetails.longUrl)

    } catch (error) {

        res.status(500).send({ status: 'error', error: error.message })
    }
}




//=====================Module Export=====================//
module.exports = { createURL, redirectURL }