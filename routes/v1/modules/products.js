const express = require('express')
const router = express.Router()
const productController = require('../../../controllers/product-controller')

// 取得單一商品
router.get('/:product_id', productController.getProduct)

// 取得所有商品
router.get('/', productController.getProducts)

module.exports = router
