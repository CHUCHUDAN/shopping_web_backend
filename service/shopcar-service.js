const { Product, Shopcar, Category } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const { CustomError } = require('../helpers/error-builder')
const { productsCheck, shopcarsCheck } = require('../helpers/shopcarCheck')

module.exports = {
  // 取得所有商品
  getShopcars: async (req, cb) => {
    try {
      const userId = getUser(req).id
      const shopcars = await Shopcar.findAll({
        raw: true,
        nest: true,
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        include: { model: Product, include: { model: Category, attributes: ['id', 'name'] } }
      })
      return cb(null, { shopcars })
    } catch (err) {
      return cb(err)
    }
  },
  // 商品加入購物車
  postShopcars: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const userId = getUser(req).id

      // 檢查商品是否存在
      const product = await Product.findByPk(productId, {
        attributes: ['id', 'inventory_quantity']
      })
      if (!product) throw new CustomError('商品不存在！', 404)

      // 檢查商品存貨是否不足
      if (product.inventory_quantity < 1) throw new CustomError('商品存貨不足！', 404)

      // 檢查是否在購物車內
      const shopcar = await Shopcar.findOne({
        where: { user_id: userId, product_id: productId },
        attributes: ['id']
      })
      if (shopcar) throw new CustomError('商品已在購物車內！', 400)

      // 新增商品至購物車
      await Shopcar.create({
        user_id: userId,
        product_id: productId,
        quantity: 1
      })
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車移除商品
  deleteShopcars: async (req, cb) => {
    try {
      const productId = req.params.product_id
      const userId = getUser(req).id

      // 檢查商品是否存在
      const product = await Product.findByPk(productId, {
        attributes: ['id']
      })
      if (!product) throw new CustomError('商品不存在！', 404)

      // 檢查是否在購物車內
      const shopcar = await Shopcar.findOne({
        where: { user_id: userId, product_id: productId },
        attributes: ['id']
      })
      if (!shopcar) throw new CustomError('商品還未加入購物車！', 400)

      // 購物車移除商品
      await shopcar.destroy()
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車商品數量增減
  patchShopcars: async (req, cb) => {
    try {
      const userId = getUser(req).id
      const body = req.body

      // 轉成只有商品id值的陣列
      const keysArray = Object.keys(body)

      // 檢查商品是否存在

      const products = await productsCheck(keysArray)
      if (products instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查是否都在該使用者的購物車內

      const shopcars = await shopcarsCheck(userId, keysArray)
      if (shopcars instanceof Error) throw new CustomError('商品還未加入購物車！', 400)

      // 檢查存貨是否足夠
      const inventoryCheck = products.every(item => {
        const productId = String(item.id)
        return item.inventory_quantity >= body[productId] && body[productId] > 0
      })

      if (!inventoryCheck) throw new CustomError('商品存貨不足或修改數量小於1!', 400)

      // 更新購物車數量
      for (const shopcar of shopcars) {
        const productId = String(shopcar.product_id)
        await shopcar.update({
          quantity: body[productId]
        })
      }
      return cb(null)
    } catch (err) {
      return cb(err)
    }
  },
  // 購物車結帳
  checkoutShopcars: async (req, cb) => {
    try {
      const userId = getUser(req).id
      const body = req.body

      // 轉成只有商品id值的陣列
      const keysArray = Object.keys(body)

      // 檢查商品是否存在
      const products = await productsCheck(keysArray)
      if (products instanceof Error) throw new CustomError('商品不存在！', 404)

      // 檢查存貨是否足夠
      const inventoryCheck = products.every(item => {
        const productId = String(item.id)
        return item.inventory_quantity >= body[productId]
      })

      if (!inventoryCheck) throw new CustomError('商品存貨不足！', 400)

      // 檢查是否在該使用者的購物車內
      const shopcars = await shopcarsCheck(userId, keysArray)
      if (shopcars instanceof Error) throw new CustomError('商品還未加入購物車！', 400)

      // 檢查商品數量是否正確
      const quantityCheck = shopcars.every(item => {
        const productId = String(item.product_id)
        return productId in body && item.quantity === body[productId]
      })

      if (!quantityCheck) throw new CustomError('請先更新購物車再進行結帳！', 400)

      // 減少商品存貨數量
      for (const product of products) {
        const productId = String(product.id)
        const quantity = body[productId]
        const inventoryQuantity = product.inventory_quantity - quantity
        await product.update({
          inventory_quantity: inventoryQuantity
        })
      }

      // 清空購物車
      for (const shopcar of shopcars) {
        await shopcar.destroy()
      }

      return cb(null)
    } catch (err) {
      return cb(err)
    }
  }
}
