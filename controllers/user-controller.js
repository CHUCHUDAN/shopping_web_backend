const { getUser } = require('../helpers/auth-helpers')
const jwt = require('jsonwebtoken')

module.exports = {
  // 登入
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
        success: true,
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}
