const {Sequelize,DataTypes}=require("sequelize");
module.exports=(sequelize)=>{
    const hashTagEntity=sequelize.define("hashTagEntity",{
        tag:{
            type:DataTypes.STRING(255),
            primaryKey:true
        }
    }, {
        timestamps:false,
        tableName:'hashtags_new'
    });
    return hashTagEntity;
};