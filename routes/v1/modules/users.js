const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')
const { validation } = require('../../../middleware/validation')
const upload = require('../../../middleware/multer')

// token 檢查使用者權限
router.post('/tokenCheck', userController.tokenCheck)

// 取得使用者資料
router.get('/', userController.getUser)

// 修改使用者密碼
router.put('/password', validation, userController.putPassword)

// 修改使用者資料
router.put('/', upload.single('avatar'), validation, userController.putUser)

module.exports = router
