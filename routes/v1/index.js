const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const storeController = require('../../controllers/store-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const products = require('./modules/products')
const carts = require('./modules/carts')
const stores = require('./modules/stores')
const users = require('./modules/users')
const { authenticated, isBuyer, isSeller, isAdmin } = require('../../middleware/auth')
const { validation } = require('../../middleware/validation')

// 登入
router.post('/users/signin', validation, passport.authenticate('local', { session: false }), userController.signIn)
// 註冊
router.post('/user', validation, userController.signUp)

// 取得商家商品清單
router.get('/stores/:seller_id', storeController.getStores)

// 取得商家資料
router.get('/users/:seller_id', userController.getSeller)

router.use('/admin', authenticated, isAdmin, admin)
router.use('/users', authenticated, users)
router.use('/stores', authenticated, isSeller, stores)
router.use('/carts', authenticated, isBuyer, carts)
router.use('/products', products)
router.use('/', apiErrorHandler)

module.exports = router
