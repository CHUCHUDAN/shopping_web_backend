const express = require('express')
const router = express.Router()
const cartController = require('../../../controllers/cart-controller')

// 取得購物車所有商品
router.get('/', cartController.getCarts)

// 購物車結帳
router.post('/checkout', cartController.checkoutCarts)

// 商品加入購物車
router.post('/:product_id', cartController.postCarts)

// 購物車移除商品
router.delete('/:product_id', cartController.deleteCarts)

// 購物車商品數量增減
router.patch('/', cartController.patchCarts)

module.exports = router
