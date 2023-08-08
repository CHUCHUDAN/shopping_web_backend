const { CartProduct, Cart, Category, Product } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { CustomError } = require('../helpers/error-builder')
const { productCheck, cartProductCheck, cartsCheck, productsCheck } = require('../helpers/productsCheck')

module.exports = {
  // 取得所有商品
  getCarts: async (req, cb) => {
    try {
      const cartId = getUser(req).Cart.id
      const cart = await Cart.findByPk(cartId, {
        include: {
          model: CartProduct,
          include: [
            {
              model: Product,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              include: {
                model: Category,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
              }
            }
          ]
        },
        order: [[{ model: CartProduct }, 'created_at', 'DESC']]
      })

      const productsOfCart = cart?.toJSON().CartProducts

      return cb(null, { productsOfCart })
    } catch (err) {
      return cb(err)
    }
  },
  // 商品加入購物車
  postCarts: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const cartId = getUser(req).Cart.id

      // 檢查商品是否存在
      const product = await productCheck(productId)
      if (product instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查商品存貨是否不足
      if (product.stock < 1) throw new CustomError('商品存貨不足！', 404)

      // 檢查是否在購物車及加入購物車
      const cartProduct = await CartProduct.findOrCreate({
        where: { cart_id: cartId, product_id: productId },
        defaults: { quantity: 1 }
      })
      if (!cartProduct[1]) throw new CustomError('商品已在購物車內！', 400)

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車移除商品
  deleteCarts: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const cartId = getUser(req).Cart.id

      // 檢查商品是否存在
      const product = await productCheck(productId)
      if (product instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查是否在購物車內
      const cartProduct = await CartProduct.findOne({
        where: { cart_id: cartId, product_id: productId }
      })
      if (!cartProduct) throw new CustomError('商品還未加入購物車！', 400)

      // 購物車移除商品
      await cartProduct.destroy()

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車商品數量增減
  patchCarts: async (req, cb) => {
    try {
      const cartId = getUser(req).Cart.id
      const body = req.body

      // 檢查購物車內是否有商品

      const cartProduct = await cartProductCheck(cartId)
      if (cartProduct instanceof Error) throw new CustomError('購物車內沒有商品！', 404)

      // 轉成只有商品id值的陣列

      const keysArray = Object.keys(body)

      // 檢查商品是否存在

      const products = await productsCheck(keysArray)
      if (products instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查是否都在該使用者的購物車內

      const cart = await cartsCheck(cartId, keysArray)
      if (cart instanceof Error) throw new CustomError('商品還未加入購物車！', 400)

      // 檢查存貨是否足夠

      const inventoryCheck = products.every(item => {
        const productId = String(item.id)
        return item.stock >= body[productId] && body[productId] > 0
      })
      if (!inventoryCheck) throw new CustomError('商品存貨不足或修改數量小於1!', 400)

      // 更新購物車數量

      const cartItems = cart.cartItems

      for (const item of cartItems) {
        const productId = String(item.id)
        const cartProduct = item.CartProduct
        await cartProduct.update({
          quantity: body[productId]
        })
      }

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車結帳
  checkoutCarts: async (req, cb) => {
    try {
      const cartId = getUser(req).Cart.id
      const body = req.body

      // 檢查購物車內是否有商品

      const cartProduct = await cartProductCheck(cartId)
      if (cartProduct instanceof Error) throw new CustomError('購物車內沒有商品！', 404)

      // 轉成只有商品id值的陣列
      const keysArray = Object.keys(body)

      // 檢查商品是否存在
      const products = await productsCheck(keysArray)
      if (products instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查存貨是否足夠
      const inventoryCheck = products.every(item => {
        const productId = String(item.id)
        return item.stock >= body[productId]
      })

      if (!inventoryCheck) throw new CustomError('商品存貨不足！', 400)

      // 檢查是否都在該使用者的購物車內

      const cart = await cartsCheck(cartId, keysArray)
      if (cart instanceof Error) throw new CustomError('商品還未加入購物車！', 400)

      // 檢查商品數量是否正確

      const cartItems = cart.cartItems
      const quantityCheck = cartItems.every(item => {
        const productId = String(item.id)
        const quantity = item.CartProduct.quantity
        return quantity === body[productId]
      })
      if (!quantityCheck) throw new CustomError('請先更新購物車再進行結帳！', 400)

      // 減少商品存貨數量
      for (const product of products) {
        const productId = String(product.id)
        const quantity = body[productId]
        const inventoryQuantity = product.stock - quantity
        await product.update({
          stock: inventoryQuantity
        })
      }

      // 清空購物車
      for (const item of cartItems) {
        const cartProduct = item.CartProduct
        await cartProduct.destroy()
      }

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}
