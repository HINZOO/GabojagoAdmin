const sequelize=require("../SequelizePool");
const commReportsEntity=require("../entity/CommReportsEntity")(sequelize);
const {Op} = require("sequelize");
const PageVo = require("../vo/PageVo");

class ReportsService {
    async list(){

        const reports = await commReportsEntity.findAll();
        return reports;
    }
}

module.exports=new ReportsService();
