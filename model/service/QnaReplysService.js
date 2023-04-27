const sequelize=require("../SequelizePool");
const qnaReplysEntity=require("../entity/QnaReplyseEntity")(sequelize);
const {Op} = require("sequelize");
const PageVo=require("../vo/PageVo");

class QnaReplysService{
    async register(reply){
        let insertId=await qnaReplysEntity.insertOne(reply);
        return insertId;
    }
    async modify(reply){
        let modify=await qnaReplysEntity.updateById(reply);
        return modify;
    }
    async remove(qrId){
        let del=await qnaReplysEntity.deleteById(qrId);
        return del;
    }
}
module.exports=QnaReplysService;