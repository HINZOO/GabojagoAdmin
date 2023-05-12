const {Sequelize, DataTypes} = require("sequelize");
module.exports = (sequelize) => {
    const tripImgsEntity = sequelize.define("tripImgsEntity", {
        ti_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        t_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "tripsEntity",
                key: "t_id",
                onDelete:"CASCADE",
                onUpdate:"CASCADE"
            }
        },
        img_path:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        img_main:{
            type: DataTypes.BOOLEAN,
            default:false
        }
    }, {
        timestamps: false,
        tableName: 'trip_imgs'
    });
    return tripImgsEntity;
}