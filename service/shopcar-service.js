const { Product, Shopcar } = require('../models')
const { getUser } = require('../helpers/auth-helpers')

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
  }
}
