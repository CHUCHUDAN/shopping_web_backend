const { CustomError } = require('../helpers/error-builder')
const { isNumeric, isLength } = require('validator')

// 商品上架資料(字數)
const NAME_STORE_MIN_COUNT = 1
const NAME_STORE_MAX_COUNT = 100

const PRICE_STORE_MIN_COUNT = 1
const PRICE_STORE_MAX_COUNT = 10

const INVENTORY_STORE_MIN_COUNT = 1
const INVENTORY_STORE_MAX_COUNT = 10

const DESCRIPTION_STORE_MIN_COUNT = 1

// 資料建構
function ObjDataGenerate (formName, type, typeParameter = {}, minCount, maxCount) {
  this.formName = formName
  this.type = type
  this.typeParameter = typeParameter
  this.minCount = minCount
  this.maxCount = maxCount
}

const validationData = {

  // 商品上架資料
  nameOfStoreValid: new ObjDataGenerate('商品名稱', undefined, undefined, NAME_STORE_MIN_COUNT, NAME_STORE_MAX_COUNT),
  priceOfStoreValid: new ObjDataGenerate('售價', isNumeric, undefined, PRICE_STORE_MIN_COUNT, PRICE_STORE_MAX_COUNT),
  inventoryOfStoreValid: new ObjDataGenerate('存貨量', isNumeric, undefined, INVENTORY_STORE_MIN_COUNT, INVENTORY_STORE_MAX_COUNT),
  descriptionOfStoreValid: new ObjDataGenerate('商品描述', undefined, undefined, DESCRIPTION_STORE_MIN_COUNT, undefined)

}

module.exports = {
  // 驗證必填、資料格式、字數
  validation: (req, res, next) => {
    try {
      const fullUrl = req.method + req.originalUrl
      const body = req.body
      let afterText = ''
      const { name, price, inventory, description } = body

      // 檢查資料來自哪個路由 && 檢查必填值
      if (fullUrl === 'POST/api/v1/stores' && (name && price && inventory && description)) {
        afterText = 'OfStoreValid'
      } else {
        throw new CustomError('所有值為必填', 400)
      }

      for (const key in body) {
        const value = body[key] // 表單傳送的value值
        const data = validationData[`${key}${afterText}`] // 資料物件

        // 檢查資料格式
        if (data.type && !data.type(value, data.typeParameter)) throw new CustomError(`${data.formName}格式錯誤`, 400)

        // 檢查字數
        if (!isLength(value, { min: data.minCount })) throw new CustomError(`${data.formName}不符合最小字數`, 400)
        if (!isLength(value, { max: data.maxCount })) throw new CustomError(`${data.formName}不符合最大字數`, 400)
      }

      return next()
    } catch (err) {
      return next(err)
    }
  }
}
