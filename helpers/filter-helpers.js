const { Op } = require('sequelize')
const minDate = '1900'
const maxDate = '2300'

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
    result.stock = { ...quantityData }
  }
  if (categoryId) {
    result.category_id = categoryId
  }
  return result
}

const userFilter = (role, startDate = minDate, endDate = maxDate) => {
  const result = {}
  if (role) {
    result.role = role
  }
  if (startDate || endDate) {
    const dateData = { [Op.between]: [startDate, endDate] }
    result.created_at = { ...dateData }
  }
  return result
}

module.exports = {
  filterSet,
  userFilter
}
