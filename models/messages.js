const Sequelize = require("sequelize");
const db = require("../utils/db");


const messages = db.define("messages",{
    message_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    room_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {    
            model: 'appointments',
            key: 'room_id'
          },
          onDelete: "CASCADE"
    },
    sender: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    type: {
        type: Sequelize.ENUM("file","message","image"),
    }
}, {
    indexes: [
        {
            fields: ["room_id"],
          },
      ],
})



// METHODS: 


const addNewMessage = async(info)=>{
    const newMessage = await messages.create(info);
    return newMessage;
}





module.exports = {
messages,
addNewMessage
}