const sequelize=require("../SequelizePool");
const qnasEntity=require("../entity/QnasEntity")(sequelize);
const usersEntity=require("../entity/UsersEntity")(sequelize);
const qnaReplysEntity=require("../entity/QnaReplys")(sequelize);
const {Op} = require("sequelize");
const PageVo=require("../vo/PageVo");

class QnasService{
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
        const totalCnt=await qnasEntity.count({
            where: whereObj
        })

        const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
        const qnas= await qnasEntity.findAll({
            offset:pageVo.offset,
            limit:pageVo.rowLength,
            where:whereObj,
            order:[orderArr]
        })
        try {
            const qnas= await qnasEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            qnas.pageVo=pageVo;
            console.log(qnas)
            return qnas;
        }catch (e) {
            new Error(e);
        }

    }
    async detail(qId){
        return await qnasEntity.findByPk(qId);
    }
    async remove(qId){
        try {
            return await qnasEntity.destroy({where:{q_id:qId}});
        }catch (e) {
            throw new Error(e);
        }
    }

}
module.exports=new QnasService();


