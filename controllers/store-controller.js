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
  },
  // 取得商家本帳號商品清單
  getSelfStores: (req, res, next) => {
    storeService.getSelfStores(req, (err, data) => {
      if (err) return next(err)
      const products = data.map(product => ({
        ...product,
        description: product.description.substring(0, PRODUCT_DESCRIPTION_LIMIT),
        addShopTime: switchTime(product.createdAt)
      }))
      return res.json({ success: true, data: { products } })
    })
  },
  // 商家上架商品
  postStores: (req, res, next) => {
    storeService.postStores(req, (err, data) => err ? next(err) : res.json({ success: true, message: '商品上架成功' }))
  },
  // 商家下架商品
  deleteStores: (req, res, next) => {
    storeService.deleteStores(req, (err, data) => err ? next(err) : res.json({ success: true, message: '商品已下架' }))
  },
  // 商家編輯商品
  putStores: (req, res, next) => {
    storeService.putStores(req, (err, data) => err ? next(err) : res.json({ success: true, message: '商品編輯成功' }))
  }
}
