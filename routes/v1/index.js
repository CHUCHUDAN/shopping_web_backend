const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const products = require('./modules/products')
const { authenticated } = require('../../middleware/auth')

// 登入
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/products', products)
router.use('/', apiErrorHandler)

module.exports = router
