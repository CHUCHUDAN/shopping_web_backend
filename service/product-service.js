const { Product } = require('../models')
const PRODUCT_DESCRIPTION_LIMIT = 20 // 商品描述字數限制

module.exports = {
  // 取得所有商品
  getProducts: async (req, cb) => {
    try {
      const products = await Product.findAll({ raw: true })
      const productsData = products.map(product => ({
        ...product,
        description: product.description.substring(0, PRODUCT_DESCRIPTION_LIMIT)
      }))

      return cb(null, { products: productsData })
    } catch (err) {
      return cb(err)
    }
  }
}
