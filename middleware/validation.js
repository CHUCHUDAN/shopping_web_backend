const { CustomError } = require('../helpers/error-builder')
const validator = require('validator')
const NAME_MIN_COUNT = 1
const NAME_MAX_COUNT = 20
const EMAIL_MIN_COUNT = 3
const EMAIL_MAX_COUNT = 50
const PASSWORD_MIN_COUNT = 3
const PASSWORD_MAX_COUNT = 50
const PHONE_MIN_COUNT = 10
const PHONE_MAX_COUNT = 10
const GENDER_MIN_COUNT = 2
const GENDER_MAX_COUNT = 2
const objDataGenerate = (formName, required, type, typeParameter, min, max) => {
  return {
    formName,
    required,
    type,
    typeParameter,
    min,
    max
  }
}
const validationData = {

  // 註冊資料
  nameOfRegisterValid: objDataGenerate('姓名', true, '', {}, NAME_MIN_COUNT, NAME_MAX_COUNT),
  emailOfRegisterValid: objDataGenerate('信箱', true, 'isEmail', {}, EMAIL_MIN_COUNT, EMAIL_MAX_COUNT),
  passwordOfRegisterValid: objDataGenerate('密碼', true, '', {}, PASSWORD_MIN_COUNT, PASSWORD_MAX_COUNT),
  passwordCheckOfRegisterValid: objDataGenerate('確認密碼', true, '', {}, PASSWORD_MIN_COUNT, PASSWORD_MAX_COUNT),

  // 登入資料
  emailOfLoginValid: objDataGenerate('信箱', true, 'isEmail', {}, EMAIL_MIN_COUNT, EMAIL_MAX_COUNT),
  passwordOfLoginValid: objDataGenerate('密碼', true, '', {}, PASSWORD_MIN_COUNT, PASSWORD_MAX_COUNT),

  // USER編輯資料
  nameOfEditValid: objDataGenerate('姓名', true, '', {}, NAME_MIN_COUNT, NAME_MAX_COUNT),
  phoneOfEditValid: objDataGenerate('電話', false, 'isMobilePhone', 'zh-TW', PHONE_MIN_COUNT, PHONE_MAX_COUNT),
  genderOfEditValid: objDataGenerate('性別', false, '', {}, GENDER_MIN_COUNT, GENDER_MAX_COUNT),
  birthOfEditValid: objDataGenerate('生日', false, 'isDate', 'YYYY-MM-DD')
}

module.exports = {
  // 驗證必填、資料格式、字數、密碼
  validation: (req, res, next) => {
    try {
      const url = req.originalUrl
      const body = req.body
      const { gender, password, passwordCheck } = body
      let afterText = ''
      console.log(body)
      // 檢查資料來自哪個路由
      if (url === '/v1/user') {
        afterText = 'OfRegisterValid'
      }
      if (url === '/v1/user/login') {
        afterText = 'OfLoginValid'
      }
      if (url === '/v1/user?_method=PUT') {
        afterText = 'OfEditValid'
      }

      for (const key in body) {
        const value = body[key] // 表單傳送的value值
        const data = validationData[`${key}${afterText}`] // 資料物件
        const type = validator[data.type] // 資料格式方法

        if (data.required && !value) throw new CustomError('所有值為必填', 400)
        if (value && type && !type(value, data.typeParameter)) throw new CustomError(`${data.formName}格式錯誤`, 400)
        if (value && data.min && !validator.isLength(value, { min: data.min })) throw new CustomError(`${data.formName}不符合最小字數`, 400)
        if (value && data.max && !validator.isLength(value, { max: data.max })) throw new CustomError(`${data.formName}不符合最大字數`, 400)
      }

      if (afterText === 'OfRegisterValid' && password && password !== passwordCheck) throw new CustomError('密碼與確認密碼不符', 400)
      if (afterText === 'OfEditValid' && gender && gender !== '女性' && gender !== '男性' && gender !== '其他') throw new CustomError('性別值不符', 400)
    } catch (err) {
      next(err)
    }
    next()
  }
}
