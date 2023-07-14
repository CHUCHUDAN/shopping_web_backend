const productService = require('../service/product-service')

module.exports = {
  // 取得所有商品
  getProducts: (req, res, next) => {
    productService.getProducts(req, (err, data) => err ? next(err) : res.json({ success: true, data }))
  }
}
