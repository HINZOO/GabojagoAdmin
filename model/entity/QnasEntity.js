const { Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize) =>{
    const qnasEntity = sequelize.define('qnasEntity',{
        q_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        u_id: {
            type:DataTypes.STRING(255),
            allowNull:false,
            references:{
                model:"usersEntity",
                key:"u_id",
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            }
        },
        title: {
            type:DataTypes.STRING(255)
        },
        content: {
            type:DataTypes.TEXT,
            allowNull:false
        },
        file_path: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        post_time: {
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
        }
    }, {
        timestamps: false,
        tableName: 'qnas' // 테이블 이름
    });
    return qnasEntity;
};