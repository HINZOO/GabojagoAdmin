const { Sequelize, DataTypes } = require('sequelize');

module.exports=(sequlize)=>{
    const follows= sequlize.define('FollowEntity', {
        f_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        to_users: {
            type: DataTypes.STRING(255),
            allowNull: false,
            reference: {
                model: 'UserEntity',
                key: "u_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        },
        from_users: {
            type: DataTypes.STRING(255),
            allowNull: false,
            reference: {
                model: 'UserEntity',
                key: "u_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        }
    },{
            timestamps: false,
            tableName:"follows"

    });
    return follows;
}