const express = require('express')
const router = express.Router()
const shopcarController = require('../../../controllers/shopcar-controller')

// 取得購物車所有商品
router.get('/', shopcarController.getShopcars)

module.exports = router
