const { CustomError } = require('../helpers/error-builder')
module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (err instanceof CustomError) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message
      })
    } else {
      res.status(500).json({
        success: false,
        message: '伺服器錯誤'
      })
    }
    next(err)
  }
}
