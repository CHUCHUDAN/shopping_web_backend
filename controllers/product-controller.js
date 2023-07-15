const productService = require('../service/product-service')
const PRODUCT_DESCRIPTION_LIMIT = 20 // 商品描述字數限制

module.exports = {
  // 取得所有商品
  getProducts: (req, res, next) => {
    productService.getProducts(req, (err, data) => {
      if (err) return next(err)
      const products = data.products.map(product => ({
        ...product,
        description: product.description.substring(0, PRODUCT_DESCRIPTION_LIMIT)
      }))
      return res.json({ success: true, data: { products } })
    })
  }
}
