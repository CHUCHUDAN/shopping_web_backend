'use strict'

const categoriesArray = [
  {
    name: '服飾',
    avatar: 'https://i.imgur.com/PKuKeLz.png'
  },
  {
    name: '居家生活',
    avatar: 'https://i.imgur.com/9M47tCF.png'
  },
  {
    name: '電玩遊戲',
    avatar: 'https://i.imgur.com/L2GxHMX.png'
  },
  {
    name: '3C筆電',
    avatar: 'https://i.imgur.com/EE3hQdZ.png'
  },
  {
    name: '精品',
    avatar: 'https://i.imgur.com/RMvazNk.png'
  },
  {
    name: '家電',
    avatar: 'https://i.imgur.com/yy51lMu.png'
  },
  {
    name: '美妝',
    avatar: 'https://i.imgur.com/WOkbGqe.png'
  },
  {
    name: '運動用品',
    avatar: 'https://i.imgur.com/YBivuhc.png'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      categoriesArray
        .map(item => {
          return {
            name: item.name,
            avatar: item.avatar,
            created_at: new Date(),
            updated_at: new Date()
          }
        }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
