const Sequelize = require("sequelize")

const sequelize = new Sequelize(
    'celse',
    'andersongarcia',
    'Genova31',
    {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}