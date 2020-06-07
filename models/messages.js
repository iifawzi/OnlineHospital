const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError} = require("../middleware/error");

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
    sender_name: {
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


const messagesFromRoom = async(room_id)=>{
    const oldMessages = await messages.findAll({where:{room_id}});
    return oldMessages;
}


const messagesFromFinished = async(room_id,res)=>{ // finished appointments messages
    try {
        const oldMessages = await messages.findAll({where:{room_id}});
        return oldMessages;
    }catch(err){
        handleError(err,res);
    }
}

module.exports = {
messages,
addNewMessage,
messagesFromRoom,
messagesFromFinished
}