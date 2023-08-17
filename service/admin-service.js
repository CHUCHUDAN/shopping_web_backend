const { User } = require('../models')
const { userFilter } = require('../helpers/filter-helpers')

module.exports = {

  // 取得使用者資料
  getUsers: async (req, cb) => {
    try {
      const startDate = req.query.startDate
      const endDate = req.query.endDate
      const role = req.query.role

      // 根據帳號類型 && 日期範圍選出user資料
      const user = await User.findAll({
        raw: true,
        attributes: { exclude: ['password'] },
        where: userFilter(role, startDate, endDate)
      })

      return cb(null, { user })
    } catch (err) {
      return cb(err)
    }
  }

}
