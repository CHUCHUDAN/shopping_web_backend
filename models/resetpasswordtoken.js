'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ResetPasswordToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  ResetPasswordToken.init({
    email: DataTypes.STRING,
    token_value: DataTypes.STRING,
    used: DataTypes.INTEGER,
    expired_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ResetPasswordToken',
    tableName: 'ResetPasswordTokens',
    underscored: true
  })
  return ResetPasswordToken
}
