const Sequelize = require("sequelize");
const config = require("config");

const sequelize = new Sequelize(
  config.get("database.name"),
  config.get("database.username"),
  config.get("database.password"),
  { dialect: "mysql", host: config.get("database.host") }
);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({force:true}); // to force the tables to update " when ( add / delete / update ) models"
    // await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
