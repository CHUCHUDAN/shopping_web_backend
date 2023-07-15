const { Product } = require('../models')
const { filterSet } = require('../helpers/filter-helpers')

const MAX_DEFAULT = Number.MAX_VALUE // 最大值預設
const MIN_DEFAULT = 0 // 最小值預設

module.exports = {
  // 取得所有商品
  getProducts: async (req, cb) => {
    try {
      const min = req.query.min ? req.query.min : MIN_DEFAULT
      const max = req.query.max ? req.query.max : MAX_DEFAULT
      const keyword = req.query.keyword ? req.query.keyword : null
      const minQuantity = req.query.minQuantity ? req.query.minQuantity : MIN_DEFAULT
      const maxQuantity = req.query.maxQuantity ? req.query.maxQuantity : MAX_DEFAULT

      const products = await Product.findAll({
        raw: true,
        where: filterSet(min, max, keyword, minQuantity, maxQuantity) // 將篩選條件丟給filterSet處理
      })

      return cb(null, { products })
    } catch (err) {
      return cb(err)
    }
  }
}