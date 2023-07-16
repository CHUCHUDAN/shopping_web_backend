const express = require('express')
const router = express.Router()
const storeController = require('../../../controllers/store-controller')

// 取得商家商品清單
router.get('/', storeController.getStores)

module.exports = router
