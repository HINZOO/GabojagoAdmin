const sequelize=require("../SequelizePool");
const commEntity=require("../entity/CommEntity")(sequelize);
const PageVo=require("../vo/PageVo");
const {Op} = require("sequelize");

class CommService{
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
            const totalCnt=await commEntity.count({
                where: whereObj
            })
            console.log(JSON.stringify(whereObj));
            const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
            const comms=await commEntity.findAll({
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
            const comm=await commEntity.findOne({
                where:{c_id:cId}
            })
            return comm;
        }catch(e){
            new Error(e);
        }

    }

    async modify(comm){
        try{
            let modify=await commEntity.update(comm,{where:{c_id:comms.c_id}})
            return modify
        }catch (e) {
            new Error(e);
        }
    }

    async remove(cId){
        try{
            let del=await commEntity.destroy({where:{c_id:cId}})
            return del;
        }catch (e) {
            new Error(e);
        }
    }
    async register(comm){
        try{
            return commEntity.create(comm)
        }catch (e) {
            new Error(e);
        }
    }
}
module.exports=new CommService();