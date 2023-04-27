const { Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize) =>{
    const qnaReplysEntity = sequelize.define('qnaReplysEntity',{
        qr_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        q_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        u_id: {
            type:DataTypes.STRING(255),
            allowNull: false,
            references:{
                model:"usersEntity",
                key:"u_id",
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_time: {
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
        },
        update_time: {
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
        },
        parent_qna_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },

    }, {
        timestamps: false,
        tableName: 'qnas' // 테이블 이름
    });
    return qnaReplysEntity;
};