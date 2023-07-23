const express = require('express')
const router = express.Router()
const storeController = require('../../../controllers/store-controller')
const { validation } = require('../../../middleware/validation')
const upload = require('../../../middleware/multer')

// 商家上架商品
router.post('/', upload.single('avatar'), validation, storeController.postStores)

// 商家下架商品
router.delete('/:product_id', storeController.deleteStores)

// 商家編輯商品
router.put('/:product_id', upload.single('avatar'), validation, storeController.putStores)

// 取得商家本帳號商品清單
router.get('/', storeController.getSelfStores)

module.exports = router
