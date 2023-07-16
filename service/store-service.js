const { Product } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helper')

module.exports = {

  // 取得商家商品清單
  getStores: async (req, cb) => {
    try {
      const userId = getUser(req).id
      const products = await Product.findAll({
        raw: true,
        where: { user_id: userId }
      })

      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  },
  // 商家上架商品
  postStores: async (req, cb) => {
    try {
      const { name, price, inventory, description } = req.body
      const userId = getUser(req).id
      const { file } = req
      const avatar = await imgurFileHandler(file)

      await Product.create({
        user_id: userId,
        name,
        price,
        inventory_quantity: inventory,
        avatar,
        description
      })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}
