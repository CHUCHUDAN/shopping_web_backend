require('dotenv').config()

module.exports = {
  development: {
    username: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'CLEARDB_DATABASE_URL'
  }
}
