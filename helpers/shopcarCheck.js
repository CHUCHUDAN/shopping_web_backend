const { Product, Shopcar } = require('../models')
const { Op } = require('sequelize')

// 檢查是否在該使用者的購物車內(多商品)

const shopcarsCheck = async (userId, productsArray) => {
  try {
    const shopcars = await Shopcar.findAll({
      where: {
        user_id: userId,
        product_id: {
          [Op.in]: productsArray
        }
      },
      attributes: ['id', 'product_id', 'quantity']
    })

    if (productsArray.length !== shopcars.length) throw new Error()
    return shopcars
  } catch (err) {
    return err
  }
}

// 檢查商品是否存在(多商品)

const productsCheck = async productsArray => {
  try {
    const products = await Product.findAll({
      where: { id: productsArray },
      attributes: ['id', 'inventory_quantity']
    })
    if (productsArray.length !== products.length) throw new Error()
    return products
  } catch (err) {
    return err
  }
}

module.exports = {
  productsCheck,
  shopcarsCheck
}
