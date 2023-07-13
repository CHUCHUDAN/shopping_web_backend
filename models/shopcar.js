'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Shopcar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Shopcar.belongsTo(models.Product, { foreignKey: 'product_id' })
      Shopcar.belongsTo(models.User, { foreignKey: 'user_id' })
    }
  };
  Shopcar.init({
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Shopcar',
    tableName: 'Shopcars',
    underscored: true
  })
  return Shopcar
}
