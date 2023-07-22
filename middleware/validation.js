const { CustomError } = require('../helpers/error-builder')
const { isNumeric, isLength } = require('validator')

// 使用者登入(字數)
const ACCOUNT_SIGNIN_MIN_COUNT = 3
const ACCOUNT_SIGNIN_MAX_COUNT = 50

const PASSWORD_SIGNIN_MIN_COUNT = 4
const PASSWORD_SIGNIN_MAX_COUNT = 50

// 商品上架資料(字數)
const NAME_STORE_MIN_COUNT = 1
const NAME_STORE_MAX_COUNT = 100

const PRICE_STORE_MIN_COUNT = 1
const PRICE_STORE_MAX_COUNT = 10

const INVENTORY_STORE_MIN_COUNT = 1
const INVENTORY_STORE_MAX_COUNT = 10

const DESCRIPTION_STORE_MIN_COUNT = 1

// 使用者註冊資料
const NAME_REGISTER_MAX_COUNT = 20

const ACCOUNT_REGISTER_MAX_COUNT = 50

const ROLE_REGISTER_MAX_COUNT = 10

// 資料建構
function ObjDataGenerate (formName, type, typeParameter = {}, minCount, maxCount) {
  this.formName = formName
  this.type = type
  this.typeParameter = typeParameter
  this.minCount = minCount
  this.maxCount = maxCount
}

const validationData = {
  // 使用者登入資料
  accountOfSigninValid: new ObjDataGenerate('帳號', undefined, undefined, ACCOUNT_SIGNIN_MIN_COUNT, ACCOUNT_SIGNIN_MAX_COUNT),
  passwordOfSigninValid: new ObjDataGenerate('密碼', undefined, undefined, PASSWORD_SIGNIN_MIN_COUNT, PASSWORD_SIGNIN_MAX_COUNT),

  // 使用者註冊資料
  nameOfRegisterValid: new ObjDataGenerate('使用者名稱', undefined, undefined, undefined, NAME_REGISTER_MAX_COUNT),
  accountOfRegisterValid: new ObjDataGenerate('帳號', undefined, undefined, undefined, ACCOUNT_REGISTER_MAX_COUNT),
  roleOfRegisterValid: new ObjDataGenerate('帳號類型', undefined, undefined, undefined, ROLE_REGISTER_MAX_COUNT),
  passwordOfRegisterValid: new ObjDataGenerate('密碼', undefined, undefined, undefined, undefined),

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
      const { file } = req
      const body = req.body
      let afterText = ''
      const { name, account, password, passwordCheck, role, price, inventory, description } = body

      // 檢查資料來自哪個路由 && 檢查必填值
      if (fullUrl === 'POST/api/v1/stores' && (name && price && inventory && description)) {
        if (file === undefined) throw new CustomError('所有值為必填', 400)
        afterText = 'OfStoreValid'
      } else if (fullUrl === 'POST/api/v1/users/signin' && (account && password)) {
        afterText = 'OfSigninValid'
      } else if (fullUrl === 'POST/api/v1/user' && (name && account && password && passwordCheck && role)) {
        if (role !== 'buyer' && role !== 'seller') throw new CustomError('帳號類型只能是buyer或seller', 400)
        if (password !== passwordCheck) throw new CustomError('密碼與確認密碼不相符', 400)
        afterText = 'OfRegisterValid'
      } else if (fullUrl.startsWith('PUT/api/v1/stores/') && (name && price && inventory && description)) {
        if (file === undefined) throw new CustomError('所有值為必填', 400)
        afterText = 'OfStoreValid'
      } else {
        throw new CustomError('所有值為必填', 400)
      }

      for (const key in body) {
        const value = body[key] // 表單傳送的value值
        const data = validationData[`${key}${afterText}`] // 資料物件

        // 檢查資料格式
        if (data?.type && !data.type(value, data.typeParameter)) throw new CustomError(`${data.formName}格式錯誤`, 400)

        // 檢查字數
        if (!isLength(value, { min: data?.minCount })) throw new CustomError(`${data.formName}不符合最小字數`, 400)
        if (!isLength(value, { max: data?.maxCount })) throw new CustomError(`${data.formName}不符合最大字數`, 400)
      }

      return next()
    } catch (err) {
      return next(err)
    }
  }
}
