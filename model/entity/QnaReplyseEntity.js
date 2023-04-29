const { Sequelize, DataTypes } = require('sequelize');
module.exports = (sequelize) =>{
    const qnaReplysEntity = sequelize.define('qnaReplysEntity',{
        qr_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        q_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references:{
                model:"qnasEntity",
                key:"q_id",
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            }
        },
        u_id: {
            type:DataTypes.INTEGER.UNSIGNED,
            allowNull:false,
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
        parent_qna_id: {
            type:DataTypes.INTEGER.UNSIGNED,

        },

    }, {
        timestamps: false,
        tableName: 'qna_replys' // 테이블 이름
    });
    return qnaReplysEntity;
};

