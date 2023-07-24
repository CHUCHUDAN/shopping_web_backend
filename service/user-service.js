const { User } = require('../models')
const { CustomError } = require('../helpers/error-builder')
const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helper')
const { Sequelize } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = {
  // 註冊
  signUp: async (req, cb) => {
    try {
      const { name, account, role, password } = req.body
      const userAccount = await User.findOne({
        where: { account: account.trim() },
        attributes: ['id']
      })

      // 檢查帳號是否已經註冊過
      if (userAccount) throw new CustomError('帳號不可重複註冊!', 400)

      await User.create({
        name: name.trim(),
        account: account.trim(),
        role: role.trim(),
        password: await bcrypt.hash(password.trim(), 10)
      })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 取得商家資料
  getSeller: async (req, cb) => {
    try {
      const sellerId = req.params.seller_id
      const seller = await User.findByPk(sellerId, {
        raw: true,
        attributes: [
          'id',
          'name',
          'account',
          'role',
          'avatar',
          'email',
          'phone',
          [Sequelize.literal('(SELECT COUNT(*) FROM `products` WHERE `products`.`user_id` = `user`.`id`)'), 'productsCount'],
          'created_at',
          'updated_at'
        ]
      })

      // 如果使用者不存在
      if (!seller) throw new CustomError('使用者不存在!', 404)

      // 如果使用者不是商家

      if (seller.role !== 'seller') throw new CustomError('使用者不存在!', 404)

      return cb(null, seller)
    } catch (err) {
      return cb(err)
    }
  },
  // 修改使用者資料
  putUser: async (req, cb) => {
    try {
      const { name, account, email, phone } = req.body
      const userId = getUser(req).id
      const user = await User.findByPk(userId)
      const { file } = req

      // 檢查使用者是否存在
      if (!user) throw new CustomError('使用者不存在!', 404)

      // 檢查帳號是否已經註冊過
      if (account !== user.account && (await User.findOne({ attributes: ['id'], where: { account: account.trim() } }))) throw new CustomError('帳號不可重複註冊!', 404)

      // 檢查信箱是否已經註冊過
      if (email && email !== user.email && (await User.findOne({ attributes: ['id'], where: { email: email.trim() } }))) throw new CustomError('信箱不可重複註冊!', 404)

      // 檢查手機是否已經註冊過
      if (phone && phone !== user.phone && (await User.findOne({ attributes: ['id'], where: { phone: phone.trim() } }))) throw new CustomError('手機不可重複註冊!', 404)

      const avatar = await imgurFileHandler(file)

      // 編輯使用者資料

      await user.update({
        name: name.trim(),
        account: account.trim(),
        email: email?.trim() || user.email,
        phone: phone?.trim() || user.phone,
        avatar: avatar || user.avatar
      })

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 修改使用者密碼
  putPassword: async (req, cb) => {
    try {
      const { passwordOld, password } = req.body
      const userId = getUser(req).id
      const user = await User.findByPk(userId)

      // 檢查使用者是否存在
      if (!user) throw new CustomError('使用者不存在!', 404)

      // 檢查舊密碼是否正確
      const res = await bcrypt.compare(passwordOld, user.password)
      if (!res) throw new CustomError('舊密碼輸入錯誤！', 404)

      // 修改密碼
      await user.update({
        password: await bcrypt.hash(password.trim(), 10)
      })

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}
