'use strict'
const faker = require('faker')
const DEFAULT_PRODUCT_LIMIT = 50

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const stores = await queryInterface.sequelize.query(
      'SELECT id FROM Stores;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',
      Array.from({ length: DEFAULT_PRODUCT_LIMIT }, (_, index) => ({
        store_id: stores[Math.floor(Math.random() * stores.length)].id,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        stock: Math.floor(Math.random() * 100) + 1,
        avatar: `https://loremflickr.com/320/240/product/?random=${Math.random() * 100}&lock=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent()
      })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', {})
  }
}
