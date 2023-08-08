'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CartProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      CartProduct.belongsTo(models.Cart, { foreignKey: 'cart_id' })
      CartProduct.belongsTo(models.Product, { foreignKey: 'product_id' })
    }
  }
  CartProduct.init({
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartProduct',
    tableName: 'CartProducts',
    underscored: true
  })
  return CartProduct
}
