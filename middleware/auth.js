const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: '沒有使用者權限' })
    req.user = user
    next()
  })(req, res, next)
}
module.exports = {
  authenticated
}
