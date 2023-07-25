'use strict'
const faker = require('faker')
const DEFAULT_PRODUCT_LIMIT = 50

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'seller';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',
      Array.from({ length: DEFAULT_PRODUCT_LIMIT }, (_, index) => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        inventory_quantity: Math.floor(Math.random() * 100) + 1,
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
