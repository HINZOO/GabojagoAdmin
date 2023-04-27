const sequelize=require("../SequelizePool");
const tripsEntity=require("../entity/TripEntity")(sequelize);
const PageVo=require("../vo/PageVo");
const {Op} = require("sequelize");

class TripsService{
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
            const totalCnt=await tripsEntity.count({
                where: whereObj
            })
            console.log(JSON.stringify(whereObj));
            const pageVo=new PageVo(reqParams.page,totalCnt,reqParams);
            const trips=await tripsEntity.findAll({
                offset:pageVo.offset,
                limit:pageVo.rowLength,
                where:whereObj,
                order:[orderArr]
            })
            trips.pageVo=pageVo;
            return trips;
        }catch (e) {
            new Error(e)
        }
    }

    //상세
    async detail(tId){
        try{
            const trip=await tripsEntity.findOne({
                where:{t_id:tId}
            })
            return trip;
        }catch(e){
            new Error(e);
        }

    }

    async modify(trip){
        try{
            let modify=await tripsEntity.update(trip,{where:{t_id:trips.t_id}})
            return modify
        }catch (e) {
            new Error(e);
        }
    }

    async remove(tId){
        try{
            let del=await tripsEntity.destroy({where:{t_id:tId}})
            return del;
        }catch (e) {
            new Error(e);
        }
    }
    async register(trip){
        try{
            return tripsEntity.create(trip)
        }catch (e) {
            new Error(e);
        }
    }
}
module.exports=new TripsService();