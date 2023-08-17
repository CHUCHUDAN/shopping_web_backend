const { CustomError } = require('../helpers/error-builder')
const { ResetPasswordToken } = require('../models')
const { Op } = require('sequelize')

// 驗證resetToken
const validateResetToken = async (req, res, next) => {
  try {
    const email = req.body.email
    const resetToken = req.body.resetToken

    if (!resetToken || !email) throw new CustomError('沒有權限', 401)

    const currentTime = new Date(Date.now())

    const token = await ResetPasswordToken.findOne({
      attributes: ['id'],
      where: {
        email: email,
        token_value: resetToken,
        used: 0,
        expired_at: {
          [Op.gt]: currentTime
        }
      }
    })

    if (!token) throw new CustomError('沒有權限', 401)
    return next()
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  validateResetToken
}
