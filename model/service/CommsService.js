const sequelize=require("../SequelizePool");
const commsEntity=require("../entity/CommEntity")(sequelize);
const PageVo=require("../vo/PageVo");
const {Op} = require("sequelize");

class CommsService{
    async list(reqParams){
        try{
            const whereObj={};
            const orderArr=[];
            if(reqParams.field && reqParams.value){
                whereObj[reqParams.field]={[Op.like]:`%${reqParams.value}%`};
            }
            if(reqParams.orderField && reqParams.orderDirect){
                orderArr.push(reqParams.orderField);
                orderArr.push(reqParams.orderDirect);
            }
            const totalCnt=await commsEntity.count({
                where: whereObj
            })
            console.log(JSON.stringify(whereObj));
            const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
            const comms=await commsEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            comms.pageVo=pageVo;
            return comms;
        }catch (e) {
            new Error(e)
        }
    }

    //상세
    async detail(cId){
        try{
            const comm=await commsEntity.findOne({
                where:{c_id:cId}
            })
            return comm;
        }catch(e){
            new Error(e);
        }

    }

    async modify(comm){
        try{
            let modify=await commsEntity.update(comm,{where:{c_id:comms.c_id}})
            return modify
        }catch (e) {
            new Error(e);
        }
    }

    async remove(cId){
        try{
            let del=await commsEntity.destroy({where:{c_id:cId}})
            return del;
        }catch (e) {
            new Error(e);
        }
    }
    async register(comm){
        try{
            return commsEntity.create(comm)
        }catch (e) {
            new Error(e);
        }
    }
}
module.exports=new CommsService();