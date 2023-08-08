const { Product, CartProduct, Category, sequelize, Store, User } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helper')
const { CustomError } = require('../helpers/error-builder')
const { productCheck } = require('../helpers/productsCheck')

module.exports = {

  // 取得商家商品清單
  getStores: async (req, cb) => {
    try {
      const sellerId = req.params.seller_id

      // 檢查商家是否存在
      const seller = await User.findByPk(sellerId, {
        raw: true,
        nest: true,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: { model: Store, attributes: { exclude: ['createdAt', 'updatedAt'] } }
      })
      if (!seller) throw new CustomError('商家不存在！', 404)

      // 取出該商家所有商品
      const storeId = seller.Store.id
      const store = await Store.findByPk(storeId, {
        include: {
          model: Product,
          include: { model: Category, attributes: { exclude: ['createdAt', 'updatedAt'] } }
        },
        order: [[{ model: Product }, 'created_at', 'DESC']]
      })

      const products = store.toJSON().Products

      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  },
  // 取得商家本帳號商品清單
  getSelfStores: async (req, cb) => {
    try {
      const storeId = getUser(req).Store.id

      // 取出本商家所有商品

      const store = await Store.findByPk(storeId, {
        include: {
          model: Product,
          include: { model: Category, attributes: { exclude: ['createdAt', 'updatedAt'] } }
        },
        order: [[{ model: Product }, 'created_at', 'DESC']]
      })

      const products = store.toJSON().Products

      return cb(null, products)
    } catch (err) {
      return cb(err)
    }
  },
  // 商家上架商品
  postStores: async (req, cb) => {
    try {
      const { name, price, inventory, description, category } = req.body

      // 檢查商品類別是否存在
      const categorySearch = await Category.findByPk(category, { raw: true, attributes: ['id'] })
      if (!categorySearch) throw new CustomError('無此商品類別！', 404)

      const storeId = getUser(req).Store.id
      const { file } = req
      const avatar = await imgurFileHandler(file)

      await Product.create({
        store_id: storeId,
        category_id: category.trim(),
        name: name.trim(),
        price: price.trim(),
        stock: inventory.trim(),
        avatar,
        description: description.trim()
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
      const storeId = getUser(req).Store.id

      // 檢查商品是否存在
      const product = await productCheck(productId)
      if (product instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查商品是否為本帳號使用者的商品
      if (product.store_id !== storeId) throw new CustomError('非本帳號商品無法下架！', 400)

      // 刪除商品跟購物車內之該商品
      const productsOfCart = await Product.findByPk(productId, {
        include: { model: CartProduct }
      })

      const cartProducts = productsOfCart.CartProducts

      for (const cartProduct of cartProducts) {
        await cartProduct.destroy({ transaction })
      }

      await product.destroy({ transaction })

      await transaction.commit()

      return cb(null)
    } catch (err) {
      await transaction.rollback()

      return cb(err)
    }
  },
  // 商家編輯商品
  putStores: async (req, cb) => {
    try {
      const { name, price, inventory, description, category } = req.body

      // 檢查商品類別是否存在
      const categorySearch = await Category.findByPk(category, { raw: true, attributes: ['id'] })
      if (!categorySearch) throw new CustomError('無此商品類別！', 404)

      const productId = req.params.product_id
      const storeId = getUser(req).Store.id
      const { file } = req

      // 檢查商品是否存在
      const product = await productCheck(productId)
      if (product instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查商品是否為本帳號使用者的商品
      if (product.store_id !== storeId) throw new CustomError('非本帳號商品無法編輯！', 400)

      const avatar = await imgurFileHandler(file)

      await product.update({
        store_id: storeId,
        category_id: category.trim(),
        name: name.trim(),
        price: price.trim(),
        stock: inventory.trim(),
        avatar,
        description: description.trim()
      })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}
