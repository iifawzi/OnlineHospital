const Sequelize = require("sequelize");
const db = require("../utils/db");

const prescriptions = db.define("prescriptions",{
    prescription_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    room_id: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description : { 
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
    indexes: [
        {
            fields: ['room_id'],
          },
      ],
})


module.exports = {
    prescriptions,
}