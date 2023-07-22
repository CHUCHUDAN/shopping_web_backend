const { getUser } = require('../helpers/auth-helpers')
const userService = require('../service/user-service')
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
      delete user.password
      return res.json({
        success: true,
        user
      })
    } catch (err) {
      return next(err)
    }
  }
}
