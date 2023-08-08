const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Store, Cart } = require('../models')
const { CustomError } = require('../helpers/error-builder')
const { Sequelize } = require('sequelize')
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
      const user = await User.findOne({ raw: true, where: { account } })
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
    const user = await User.findByPk(jwtPayload.id, {
      raw: true,
      nest: true,
      include: [
        { model: Store, attributes: ['id'] },
        { model: Cart, attributes: ['id'] }
      ],
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'email',
        'phone',
        'role',
        [Sequelize.literal('(SELECT COUNT(*) FROM `products` WHERE `products`.`store_id` = `store`.`id`)'), 'productsCount'],
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
