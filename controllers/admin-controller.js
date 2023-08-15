const adminService = require('../service/admin-service')

module.exports = {

  // 取得使用者資料
  getUsers: (req, res, next) => {
    adminService.getUsers(req, (err, data) => {
      if (err) return next(err)
      const user = data.user
      return res.json({ success: true, data: { user } })
    })
  }
}
