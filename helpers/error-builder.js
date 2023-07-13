
function CustomError (message, statusCode) {
  this.name = '警告'
  this.message = message
  this.status = statusCode
}

CustomError.prototype = new Error()
CustomError.prototype.constructor = CustomError

module.exports = {
  CustomError
}
