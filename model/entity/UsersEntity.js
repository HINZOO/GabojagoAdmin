const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('UsersEntity', {
        u_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        pw: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        nk_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        birth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        detail_address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        pr_content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        permission: {
            type: DataTypes.ENUM('USER', 'PARTNER', 'ADMIN'),
            allowNull: false,
            defaultValue:"USER"
        },
        mbti: {
            type: DataTypes.ENUM('ISTJ', 'ISTP', 'ISFJ', 'ISFP', 'INTJ', 'INTP', 'INFJ', 'INFP', 'ESTJ', 'ESTP', 'ESFJ', 'ESFP', 'ENTJ', 'ENTP', 'ENFJ', 'ENFP'),
            allowNull: false
        },
        img_path: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        post_time: {
            type: DataTypes.DATE,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
        },
        store_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        business_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'users' // 테이블 이름
    });

    return User;
};
