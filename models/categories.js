const Sequelize = require("sequelize");
const db = require("../utils/db");


const categories = db.define("categories",{
category_id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true,
},
en:{
    type:Sequelize.STRING,
    allowNull: false,
},
ar:{
    type:Sequelize.STRING,
    allowNull:false,
}
},{
    freezeTableName: true,
    timestamps: false,
})


module.exports = {
    categories
};


