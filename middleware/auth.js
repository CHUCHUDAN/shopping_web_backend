const passport = require('../config/passport')
const { getUser } = require('../helpers/auth-helpers')
const { CustomError } = require('../helpers/error-builder')

// 登入權限檢查token是否有效
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: '沒有使用者權限' })
    req.user = user
    next()
  })(req, res, next)
}
// 檢查是否為買家
const isBuyer = (req, res, next) => {
  try {
    const user = getUser(req)
    if (user.role !== 'buyer') throw new CustomError('你不是買家不能使用購物車功能', 401)
    return next()
  } catch (err) {
    return next(err)
  }
}
// 檢查是否為商家
const isSeller = (req, res, next) => {
  try {
    const user = getUser(req)
    if (user.role !== 'seller') throw new CustomError('你不是商家不能使用商家功能', 401)
    return next()
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  authenticated,
  isBuyer,
  isSeller
}
