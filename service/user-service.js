const { User } = require('../models')
const { CustomError } = require('../helpers/error-builder')
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
  }
}
