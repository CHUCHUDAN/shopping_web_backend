'use strict'
const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'buyer',
      account: 'buyer001',
      password: await bcrypt.hash('titaner', 10),
      role: 'buyer',
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }, {
      name: 'seller',
      account: 'seller001',
      password: await bcrypt.hash('titaner', 10),
      role: 'seller',
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }, {
      name: 'buyer2',
      account: 'buyer002',
      password: await bcrypt.hash('titaner', 10),
      role: 'buyer',
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }, {
      name: 'seller2',
      account: 'seller002',
      password: await bcrypt.hash('titaner', 10),
      role: 'seller',
      created_at: faker.date.past(),
      updated_at: faker.date.recent()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
