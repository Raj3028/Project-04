//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const { createURL, redirectURL } = require('../Controller/urlController')


//===================== Create Shorten URL From Long URL(Post API) =====================//
router.post("/url/shorten", createURL)

//===================== Create URL data from DB(Get API) =====================//
router.get("/:urlCode", redirectURL)


//=====================Module Export=====================//
module.exports = router;  