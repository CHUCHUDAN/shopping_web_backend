'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      "SELECT * FROM Users WHERE role = 'buyer';",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Carts',
      Array.from({ length: users.length }, (_, index) => ({
        user_id: users[index].id,
        created_at: users[index].created_at,
        updated_at: users[index].updated_at
      })), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Carts', {})
  }
}
