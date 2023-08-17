const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

// 取得使用者資料
router.get('/users', adminController.getUsers)

module.exports = router
