const {Sequelize,DataTypes}=require("sequelize");

module.exports=(sequlize)=>{
    const commReports = sequlize.define('commReportsEntity', {
        cr_id : { // 커뮤 신고글 아이디
            type : DataTypes.INTEGER.UNSIGNED,
            primaryKey : true,
            autoIncrement : true
        },
        c_id: { // 커뮤 글 아이디
            type : DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            reference : {
                model : 'CommEntity',
                key : "c_id",
                onDelete : "CASCADE",
                onUpdate : "CASCADE"
            }
        },
        u_id: { // 유저 아이디
            type:DataTypes.STRING(255),
            allowNull : false,
            references : {
                model : "usersEntity",
                key : "u_id",
                onDelete : "CASCADE",
                onUpdate : "CASCADE"
            }
        },
        content: { // 신고 내용
            type:DataTypes.TEXT,
            allowNull:true
        },
        post_time: { // 작성 시간
            type:DataTypes.DATE,
            defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
        }
    },{
        timestamps: false,
        tableName:"comm_reports"

    });
    return commReports;
}
