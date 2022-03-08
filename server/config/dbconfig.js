const dbName = "zoey";
const dbUser = "root";
const dbPasswrd = "123456"
const Sequelize = require("sequelize")

module.exports = DB = new Sequelize(dbName, dbUser, dbPasswrd, {
    host: "localhost",
    prot: 3306,
    dialect: "mysql",
    pool: {
        max: 20,
        min: 3,
        dile: 1000
    }
});