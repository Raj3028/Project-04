//=====================Importing Module and Packages=====================//
const express = require('express');
const router = express.Router();
const createURL = require('../Controller/urlController')





//===================== Create (Post API) =====================//
router.post("/url/shorten", createURL)




//=====================Module Export=====================//
module.exports = router;  