const Sequelize = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(
  config.get("database.name"),
  config.get("database.username"),
  config.get("database.password"),
  { dialect: "mysql", host: config.get("database.host"), define:{
    charset: 'utf8',
    collate: 'utf8_general_ci',
  } }
);

(async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync({force:true}); // to force the tables to update " when ( add / delete / update ) models"
    await sequelize.sync(); 
    // SET SQL_SAFE_UPDATES = 0; // when re-set the schema use this command in the mysql management.
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
