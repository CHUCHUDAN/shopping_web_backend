const { getUser } = require('../helpers/auth-helpers')
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
  }
}
