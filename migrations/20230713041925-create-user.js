'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      account: {
        allowNull: false,
        type: Sequelize.STRING(50),
        unique: true
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/BMxWxE8.jpeg'
      },
      email: {
        type: Sequelize.STRING(50),
        unique: true
      },
      phone: {
        type: Sequelize.STRING(11),
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users')
  }
}
