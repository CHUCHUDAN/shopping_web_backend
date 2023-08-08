const { Product, User, Category, Store } = require('../models')
const { filterSet } = require('../helpers/filter-helpers')
const { CustomError } = require('../helpers/error-builder')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const MAX_DEFAULT = Number.MAX_VALUE // 最大值預設
const MIN_DEFAULT = 0 // 最小值預設
const DEFAULT_LIMIT = 10 // 預設每頁10筆資料
const DEFAULT_PAGE = 1 // 預設當前頁數

module.exports = {
  // 取得所有商品
  getProducts: async (req, cb) => {
    try {
      const min = req.query.min ? req.query.min : MIN_DEFAULT
      const max = req.query.max ? req.query.max : MAX_DEFAULT
      const minQuantity = req.query.minQuantity ? req.query.minQuantity : MIN_DEFAULT
      const maxQuantity = req.query.maxQuantity ? req.query.maxQuantity : MAX_DEFAULT
      const keyword = req.query.keyword
      const categoryId = req.query.category_id
      const page = Number(req.query.page) || DEFAULT_PAGE
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const products = await Product.findAndCountAll({
        raw: true,
        where: filterSet(min, max, keyword, minQuantity, maxQuantity, categoryId), // 將篩選條件丟給filterSet處理
        order: [['created_at', 'DESC']],
        limit,
        offset
      })

      return cb(null, { products, pagination: getPagination(limit, page, products.count) })
    } catch (err) {
      return cb(err)
    }
  },
  // 取得單一商品
  getProduct: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const product = await Product.findByPk(productId, {
        raw: true,
        nest: true,
        include: [
          { model: Store, attributes: ['id', 'user_id'], include: { model: User, attributes: ['id', 'name'] } },
          { model: Category, attributes: ['id', 'name'] }
        ]
      })

      // 檢查商品是否存在
      if (!product) throw new CustomError('商品不存在！', 404)

      const userId = product.Store.User.id

      // 檢查該商品商家否存在
      if (!userId) throw new CustomError('商家不存在！', 404)

      return cb(null, { product })
    } catch (err) {
      return cb(err)
    }
  },
  // 取得所有商品分類
  getCategories: async (req, cb) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        attributes: ['id', 'name', 'avatar']
      })
      return cb(null, { categories })
    } catch (err) {
      return cb(err)
    }
  }
}
