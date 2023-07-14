'use strict'
const faker = require('faker')
const DEFAULT_PRODUCT_LIMIT = 50

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products',
      Array.from({ length: DEFAULT_PRODUCT_LIMIT }, (_, index) => ({
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
