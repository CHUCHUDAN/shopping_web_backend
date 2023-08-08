const { Product, CartProduct, Cart } = require('../models')
const { Op } = require('sequelize')

// 檢查商品是否存在(單商品)

const productCheck = async productId => {
  try {
    const product = await Product.findByPk(productId, {
      attributes: ['id', 'store_id', 'stock']
    })
    if (!product) throw new Error()
    return product
  } catch (err) {
    return err
  }
}

// 檢查購物車內是否有商品

const cartProductCheck = async cartId => {
  try {
    const cartProduct = await CartProduct.findOne({
      where: { cart_id: cartId },
      attributes: ['id']
    })
    if (!cartProduct) throw new Error()
    return cartProduct
  } catch (err) {
    return err
  }
}

// 檢查是否在該使用者的購物車內(多商品)

const cartsCheck = async (cartId, productsArray) => {
  try {
    const cart = await Cart.findByPk(cartId, {
      include: {
        model: Product,
        as: 'cartItems',
        attributes: ['id'],
        where: {
          id: {
            [Op.in]: productsArray
          }
        }
      }
    })
    const cartLength = cart.toJSON().cartItems.length

    if (productsArray.length !== cartLength) throw new Error()
    return cart
  } catch (err) {
    return err
  }
}

// 檢查商品是否存在(多商品)

const productsCheck = async productsArray => {
  try {
    const products = await Product.findAll({
      where: { id: productsArray },
      attributes: ['id', 'stock']
    })
    if (productsArray.length !== products.length) throw new Error()
    return products
  } catch (err) {
    return err
  }
}

module.exports = {
  productCheck,
  cartProductCheck,
  cartsCheck,
  productsCheck
}
