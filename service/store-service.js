const { Product } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

module.exports = {

  // 取得商家商品清單
  getStores: async (req, cb) => {
    try {
      const userId = getUser(req).id
      const products = await Product.findAll({
        raw: true,
        where: { user_id: userId },
        order: [['created_at', 'DESC']]
      })

      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  }
}
