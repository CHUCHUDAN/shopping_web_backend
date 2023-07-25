'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Product.hasMany(models.Shopcar, { foreignKey: 'product_id' })
      Product.belongsTo(models.User, { foreignKey: 'user_id' })
      Product.belongsTo(models.Category, { foreignKey: 'category_id' })
    }
  };
  Product.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    inventory_quantity: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true
  })
  return Product
}
