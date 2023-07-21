const storeService = require('../service/store-service')
const PRODUCT_DESCRIPTION_LIMIT = 50 // 商品描述字數限制
const { switchTime } = require('../helpers/dayFix-helper')

module.exports = {
  // 取得商家商品清單
  getStores: (req, res, next) => {
    storeService.getStores(req, (err, data) => {
      if (err) return next(err)
      const products = data.map(product => ({
        ...product,
        description: product.description.substring(0, PRODUCT_DESCRIPTION_LIMIT),
        addShopTime: switchTime(product.createdAt)
      }))
      return res.json({ success: true, data: { products } })
    })
  }
}
