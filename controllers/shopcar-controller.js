const shopcarService = require('../service/shopcar-service')

module.exports = {
  // 取得購物車所有商品及總金額
  getShopcars: (req, res, next) => {
    shopcarService.getShopcars(req, (err, data) => {
      if (err) return next(err)
      let totalAmount = 0
      const shopcars = data.shopcars.map(shopcar => {
        const price = shopcar.Product.price
        const quantity = shopcar.quantity
        const sumOfMoney = price * quantity
        totalAmount += sumOfMoney
        return shopcar
      })
      return res.json({ success: true, data: { totalAmount, shopcars } })
    })
  },
  // 商品加入購物車
  postShopcars: (req, res, next) => {
    shopcarService.postShopcars(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '成功加入購物車!' })
    })
  },
  // 購物車移除商品
  deleteShopcars: (req, res, next) => {
    shopcarService.deleteShopcars(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '成功移除商品!' })
    })
  },
  // 購物車商品數量增減
  patchShopcars: (req, res, next) => {
    shopcarService.patchShopcars(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '成功修改商品數量!' })
    })
  },
  // 購物車結帳
  checkoutShopcars: (req, res, next) => {
    shopcarService.checkoutShopcars(req, err => {
      if (err) return next(err)
      return res.json({ success: true, message: '結帳成功!' })
    })
  }
}
