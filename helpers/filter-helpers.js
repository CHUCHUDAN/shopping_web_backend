const { Op } = require('sequelize')

const filterSet = (min, max, keyword, minQuantity, maxQuantity, categoryId) => {
  const result = {}
  if (min || max) {
    const priceData = { [Op.between]: [min, max] }
    result.price = { ...priceData }
  }
  if (keyword) {
    const nameData = { [Op.like]: `%${keyword}%` }
    result.name = { ...nameData }
  }
  if (minQuantity || maxQuantity) {
    const quantityData = { [Op.between]: [minQuantity, maxQuantity] }
    result.inventory_quantity = { ...quantityData }
  }
  if (categoryId) {
    result.category_id = categoryId
  }
  return result
}
module.exports = {
  filterSet
}
