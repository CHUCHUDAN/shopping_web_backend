const productService = require('../service/product-service')
const { switchTime } = require('../helpers/dayFix-helper')
const PRODUCT_DESCRIPTION_LIMIT = 20 // 商品描述字數限制

module.exports = {
  // 取得所有商品
  getProducts: (req, res, next) => {
    productService.getProducts(req, (err, data) => {
      if (err) return next(err)
      const products = data.products.rows.map(product => ({
        ...product,
        description: product.description.substring(0, PRODUCT_DESCRIPTION_LIMIT)
      }))
      return res.json({ success: true, data: { products, pagination: data.pagination } })
    })
  },
  // 取得單一商品
  getProduct: (req, res, next) => {
    productService.getProduct(req, (err, data) => {
      if (err) return next(err)
      const product = data.product

      product.addShopTime = switchTime(product.createdAt)
      return res.json({ success: true, data: { product } })
    })
  }
}
