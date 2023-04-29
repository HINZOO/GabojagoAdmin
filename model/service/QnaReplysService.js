const sequelize=require("../SequelizePool");
const qnaReplysEntity=require("../entity/QnaReplyseEntity")(sequelize);
const usersEntity=require("../entity/UsersEntity")(sequelize);
const {Op} = require("sequelize");
const PageVo=require("../vo/PageVo");
class QnaReplysService{
    async list(reqParams){
        const whereObj={};
        const orderArr =[];
        if(reqParams.field && reqParams.value){
            whereObj[reqParams.field]={[Op.like]:`%${reqParams.value}%`};
        }
        if(reqParams.orderField && reqParams.orderDirect){
            orderArr.push(reqParams.orderField);
            orderArr.push(reqParams.orderDirect);
        }
        const totalCnt=await qnaReplysEntity.count({
            where: whereObj
        })

        const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);

        try {
            const Replys= await qnaReplysEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            Replys.pageVo=pageVo;
            console.log(Replys)
            return Replys;
        }catch (e) {
            new Error(e);
        }
    }
    async modify(replys){
        try {
            const modify=await qnaReplysEntity.update(replys);
        }catch (e) {
            new Error(e);
        }
    }
    async register(replys) {
        try {
            return qnaReplysEntity.create(replys);
        }catch (e) {
            new Error(e);
        }
    }
    async remove(qrId){
        try {
            return await qnaReplysEntity.destroy({where:{qr_id:qrId}});
        }catch (e) {
            throw new Error(e);
        }
    }
}
module.exports=new QnaReplysService();