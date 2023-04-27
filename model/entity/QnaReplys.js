const { Sequelize, DataTypes } = require('sequelize');


module.exports = (sequelize) =>{
    const Qna = sequelize.define('QnaReplysEntity',{
        qr_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true
        },
        q_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
        u_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        post_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        update_time: {
            type: DataTypes.DATE,
            allowNull: false
        },

    }, {
        timestamps: false,
        tableName: 'qnas' // 테이블 이름
    });
};