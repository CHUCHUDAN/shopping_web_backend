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
  }
}
