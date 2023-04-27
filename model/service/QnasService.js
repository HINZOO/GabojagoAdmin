const sequelize=require("../SequelizePool");
const usersEntity=require("../entity/QnasEntity")(sequelize);
const {Op, where}=require("sequelize");

