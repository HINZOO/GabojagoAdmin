const {Sequelize,DataTypes}=require("sequelize");
module.exports=(sequelize)=>{
    const plansEntity=sequelize.define("plansEntity", {
        p_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        u_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
            references: {
                model: "usersEntity",
                key: "u_id",
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            }
        },
        post_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        },
        update_time: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
        },
        title: {
            type: DataTypes.STRING(255)
        },
        info: {
            type: DataTypes.STRING(255)
        },
        plan_from: {
            type: DataTypes.DATE,
        },
        plan_to: {
            type: DataTypes.DATE,
        },
        img_path: {
            type: DataTypes.STRING(255)
        },
        plan_state: {
            type: DataTypes.ENUM('PUBLIC', 'PRIVATE'),
            defaultValue: 'PUBLIC'
        },
        review: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }


    }, {
        timestamps: false,
        tableName: 'plans' // 테이블 이름
    });
    return plansEntity
};
