const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')

// token 檢查使用者權限
router.post('/tokenCheck', userController.tokenCheck)

// 取得使用者資料
router.get('/', userController.getUser)

module.exports = router
