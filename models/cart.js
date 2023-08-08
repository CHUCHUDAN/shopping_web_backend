'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Cart.belongsTo(models.User, { foreignKey: 'user_id' })
      Cart.hasMany(models.CartProduct, { foreignKey: 'cart_id' })
      Cart.belongsToMany(models.Product, {
        through: models.CartProduct,
        foreignKey: 'cart_id',
        as: 'cartItems'
      })
    }
  }
  Cart.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'Carts',
    underscored: true
  })
  return Cart
}
