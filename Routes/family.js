const express = require("express")
const { getDetails, getCustomDetails } = require("../Controllers/getAllDetails")
const router = express.Router()


//GET Methods
router.get('/fetchAll', getDetails)

router.get('/customData', getCustomDetails)

module.exports = router