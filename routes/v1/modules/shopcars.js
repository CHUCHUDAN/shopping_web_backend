const express = require('express')
const router = express.Router()
const shopcarController = require('../../../controllers/shopcar-controller')

// 取得購物車所有商品
router.get('/', shopcarController.getShopcars)

// 購物車結帳
router.post('/checkout', shopcarController.checkoutShopcars)

// 商品加入購物車
router.post('/:product_id', shopcarController.postShopcars)

// 購物車移除商品
router.delete('/:product_id', shopcarController.deleteShopcars)

// 購物車商品數量增減
router.patch('/', shopcarController.patchShopcars)

module.exports = router
