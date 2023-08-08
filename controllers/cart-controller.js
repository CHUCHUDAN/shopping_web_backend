const cartService = require('../service/cart-service')

module.exports = {
  // 取得購物車所有商品及總金額
  getCarts: (req, res, next) => {
    cartService.getCarts(req, (err, data) => {
      if (err) return next(err)

      // 計算總金額
      let totalAmount = 0

      const productsOfCart = data.productsOfCart?.map(product => {
        const price = product.Product.price
        const quantity = product.quantity
        const sumOfMoney = price * quantity
        totalAmount += sumOfMoney
        return product
      })
      return res.json({ success: true, data: { totalAmount, productsOfCart } })
    })
  },
  // 商品加入購物車
  postCarts: (req, res, next) => {
    cartService.postCarts(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '成功加入購物車!' })
    })
  },
  // 購物車移除商品
  deleteCarts: (req, res, next) => {
    cartService.deleteCarts(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '成功移除商品!' })
    })
  },
  // 購物車商品數量增減
  patchCarts: (req, res, next) => {
    cartService.patchCarts(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '成功修改商品數量!' })
    })
  },
  // 購物車結帳
  checkoutCarts: (req, res, next) => {
    cartService.checkoutCarts(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '結帳成功!' })
    })
  }
}
