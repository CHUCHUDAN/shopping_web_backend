'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Store.belongsTo(models.User, { foreignKey: 'user_id' })
      Store.hasMany(models.Product, { foreignKey: 'store_id' })
    }
  }
  Store.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Store',
    tableName: 'Stores',
    underscored: true
  })
  return Store
}
