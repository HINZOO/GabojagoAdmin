const { Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize) =>{
    const qnasEntity = sequelize.define('qnasEntity',{
        q_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        u_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type:DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        file_path: {
            type: DataTypes.STRING(255),
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