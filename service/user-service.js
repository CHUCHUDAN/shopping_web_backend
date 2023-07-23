const { User } = require('../models')
const { CustomError } = require('../helpers/error-builder')
const { Sequelize } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = {
  // 註冊
  signUp: async (req, cb) => {
    try {
      const { name, account, role, password } = req.body
      const userAccount = await User.findOne({
        where: { account },
        attributes: ['id']
      })

      // 檢查帳號是否已經註冊過
      if (userAccount) throw new CustomError('帳號不可重複註冊!', 400)

      await User.create({
        name,
        account,
        role,
        password: await bcrypt.hash(password, 10)
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

      if (seller.role !== 'seller') throw new CustomError('使用者不存在!', 400)

      return cb(null, seller)
    } catch (err) {
      return cb(err)
    }
  }
}
