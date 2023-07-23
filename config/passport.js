const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { CustomError } = require('../helpers/error-builder')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 本地登入
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password'
  },
  // 登入時驗證使用者帳密
  async (account, password, cb) => {
    try {
      const user = await User.findOne({ where: { account } })
      if (!user) throw new CustomError('帳號或密碼輸入錯誤！', 404)
      const res = await bcrypt.compare(password, user.password)
      if (!res) throw new CustomError('帳號或密碼輸入錯誤！', 404)
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  }))
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
// 每次req都驗證token
passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    // 檢查 JWT 的到期日
    const expirationDate = new Date(jwtPayload.exp * 1000)
    const currentDate = new Date()

    if (expirationDate < currentDate) {
      // JWT 已過期，拒絕驗證
      return cb(null, false)
    }
    const user = await User.findByPk(jwtPayload.id, {
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'email',
        'phone',
        'role',
        'createdAt',
        'updatedAt'
      ]
    })
    return cb(null, user)
  } catch (err) {
    return cb(err)
  }
}))

module.exports = passport
