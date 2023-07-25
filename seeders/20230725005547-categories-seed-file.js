'use strict'

const categoriesArray = [
  {
    name: '服飾',
    avatar: 'https://i.imgur.com/JXUU3fg.jpeg'
  },
  {
    name: '居家生活',
    avatar: 'https://i.imgur.com/IFK3RkV.jpeg'
  },
  {
    name: '電玩遊戲',
    avatar: 'https://i.imgur.com/RvVoWYU.jpeg'
  },
  {
    name: '3C筆電',
    avatar: 'https://i.imgur.com/9HEWULh.png'
  },
  {
    name: '精品',
    avatar: 'https://i.imgur.com/3Z9XkO4.jpeg'
  },
  {
    name: '家電',
    avatar: 'https://i.imgur.com/Qo5do23.jpeg'
  },
  {
    name: '美妝',
    avatar: 'https://i.imgur.com/SBjTbTf.png'
  },
  {
    name: '運動用品',
    avatar: 'https://i.imgur.com/WVUr9f3.jpeg'
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
