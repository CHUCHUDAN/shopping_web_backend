const { getUser } = require('../helpers/auth-helpers')
const userService = require('../service/user-service')
const { relativeTimeFromNow } = require('../helpers/dayFix-helper')
const jwt = require('jsonwebtoken')

module.exports = {
  // 登入
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '2d' }) // 簽發 JWT，效期為 30 天
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) // 取出到期日
      const expirationDate = new Date(decodedToken.exp * 1000) // 到期日轉換

      return res.json({
        success: true,
        data: {
          token,
          expired: expirationDate,
          user: userData
        }
      })
    } catch (err) {
      return next(err)
    }
  },
  // 註冊
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) => err ? next(err) : res.json({ success: true, message: '註冊成功' }))
  },
  // token 檢查使用者權限
  tokenCheck: (req, res, next) => {
    try {
      return res.json({
        success: true,
        message: '權限正常'
      })
    } catch (err) {
      return next(err)
    }
  },
  // 取得使用者資料
  getUser: (req, res, next) => {
    try {
      const user = getUser(req).toJSON()
      user.createdTimeFromNow = relativeTimeFromNow(user.createdAt)
      return res.json({ success: true, data: { user } })
    } catch (err) {
      return next(err)
    }
  },
  // 取得商家資料
  getSeller: (req, res, next) => {
    userService.getSeller(req, (err, data) => {
      if (err) return next(err)
      data.createdTimeFromNow = relativeTimeFromNow(data.created_at)
      return res.json({ success: true, data: { seller: data } })
    })
  },
  // 修改使用者資料
  putUser: (req, res, next) => {
    userService.putUser(req, (err, data) => err ? next(err) : res.json({ success: true, message: '個人資料修改成功' }))
  }
}
