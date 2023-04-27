//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const { urlShorter, redirectURL } = require('../Controller/urlController.js')


//===================== Create Shorten URL From Long URL(Post API) =====================//
router.post("/url/shorten", urlShorter)

//===================== Create URL data from DB(Get API) =====================//
router.get("/:urlCode", redirectURL)


//=====================Module Export=====================//
module.exports = router;  
