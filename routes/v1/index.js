const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const products = require('./modules/products')
const shopcars = require('./modules/shopcars')
const stores = require('./modules/stores')
const users = require('./modules/users')
const upload = require('../../middleware/multer')
const { authenticated, isBuyer, isSeller } = require('../../middleware/auth')
const { validation } = require('../../middleware/validation')

// 登入
router.post('/users/signin', upload.single('avatar'), validation, passport.authenticate('local', { session: false }), userController.signIn)

router.use('/users', authenticated, users)
router.use('/stores', authenticated, isSeller, stores)
router.use('/shopcars', authenticated, isBuyer, shopcars)
router.use('/products', products)
router.use('/', apiErrorHandler)

module.exports = router
