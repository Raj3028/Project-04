//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const { createURL, redirectURL } = require('../Controller/urlController')



//===================== Create (Post API) =====================//
router.post("/url/shorten", createURL)

//===================== Create (Get API) =====================//
router.get("/:urlCode", redirectURL)


//=====================Module Export=====================//
module.exports = router;  