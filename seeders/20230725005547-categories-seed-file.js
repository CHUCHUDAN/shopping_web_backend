'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      ['服飾', '居家生活', '電玩遊戲', '3C筆電', '精品', '家電', '美妝', '運動用品']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
