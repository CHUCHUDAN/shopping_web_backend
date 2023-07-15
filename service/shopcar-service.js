const { Product, Shopcar } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { CustomError } = require('../helpers/error-builder')

module.exports = {
  // 取得所有商品
  getShopcars: async (req, cb) => {
    try {
      const userId = getUser(req).id
      const shopcars = await Shopcar.findAll({
        raw: true,
        nest: true,
        where: { user_id: userId },
        include: { model: Product }
      })
      return cb(null, { shopcars })
    } catch (err) {
      return cb(err)
    }
  },
  // 商品加入購物車
  postShopcars: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const userId = getUser(req).id

      // 檢查商品是否存在
      const product = await Product.findByPk(productId, {
        attributes: ['id']
      })
      if (!product) throw new CustomError('商品不存在！', 404)

      // 檢查是否在購物車內
      const shopcars = await Shopcar.findOne({
        where: { user_id: userId, product_id: productId },
        attributes: ['id']
      })
      if (shopcars) throw new CustomError('商品已在購物車內！', 400)

      // 新增商品至購物車
      await Shopcar.create({
        user_id: userId,
        product_id: productId,
        quantity: 1
      })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車移除商品
  deleteShopcars: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const userId = getUser(req).id

      // 檢查商品是否存在
      const product = await Product.findByPk(productId, {
        attributes: ['id']
      })
      if (!product) throw new CustomError('商品不存在！', 404)

      // 檢查是否在購物車內
      const shopcars = await Shopcar.findOne({
        where: { user_id: userId, product_id: productId },
        attributes: ['id']
      })
      if (!shopcars) throw new CustomError('商品還未加入購物車！', 400)

      // 購物車移除商品
      await shopcars.destroy()
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}
