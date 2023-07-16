const { Product, Shopcar, sequelize } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helper')
const { CustomError } = require('../helpers/error-builder')

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
  },
  // 商家下架商品
  deleteStores: async (req, cb) => {
    // 設定transaction讓數據庫保持一致性
    const transaction = await sequelize.transaction()

    try {
      const productId = req.params.product_id
      const userId = getUser(req).id

      // 檢查商品是否存在
      const product = await Product.findByPk(productId, {
        attributes: ['id', 'user_id']
      })
      if (!product) throw new CustomError('商品不存在！', 404)

      // 檢查商品是否為本帳號使用者的商品
      if (product.user_id !== userId) throw new CustomError('非本帳號商品無法下架！', 404)

      // 刪除商品跟購物車內之該商品

      await product.destroy({ transaction })
      const shopcars = await Shopcar.findAll({ where: { product_id: productId }, transaction })
      for (const shopcar of shopcars) {
        await shopcar.destroy({ transaction })
      }

      await transaction.commit()

      return cb(null)
    } catch (err) {
      await transaction.rollback()

      return cb(err)
    }
  }
}
