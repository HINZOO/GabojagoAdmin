const {Sequelize,DataTypes}=require("sequelize");
module.exports=(sequelize)=>{
    const tripHashTagEntity=sequelize.define("tripHashTagEntity",{
        th_id:{
            type:DataTypes.INTEGER.UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        t_id:{
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull:false,
            references:{
                model:"tripsEntity",
                key:"t_id",
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            }
        },
        tag:{
            type:DataTypes.STRING(255),
            allowNull: false,
            references:{
                model:"hashTagEntity",
                key:"tag",
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            }
        }
    },{
       timestamps:false,
       tableName: 'trip_hashtags',
    });
    return tripHashTagEntity;
};