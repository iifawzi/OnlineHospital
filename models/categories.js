const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError} = require("../middleware/error");


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


const getCatsSpecific = async function (req){ // this will return categories where there're doctors registered in
try {
    const categories =  await db.query("SELECT * FROM `categories` cats where cats.category_id IN (SELECT docs.category_id FROM `doctors` docs GROUP BY cats.category_id ) ",{
        type: Sequelize.QueryTypes.SELECT,
    });
    return categories;
}catch(err){
    handleError(err,res);
}
}

getAllCategories = async function (){
    const categoriesData = await categories.findAll();
    return categoriesData;
}

module.exports = {
    categories,
    getCatsSpecific,
    getAllCategories
};


