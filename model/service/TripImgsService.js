const sequelize=require("../SequelizePool");
const tripImgsEntity = require("../entity/TripImgsEntity")(sequelize);

class TripImgsService {
    async detail(tiId){
        try {

            const tripImg=await tripImgsEntity.findOne({
                where: {ti_id : tiId}
            })
            console.log("tiId 서비스", tiId);
            console.log("tripImg 서비스의 img", tripImg);
            return tripImg;
        }catch (e){
            console.log(e);
            new Error(e);
        }
    }

    async modify(main) {
        try {
            return await tripImgsEntity.update({
                where: {t_id: main.t_id}
            });
        } catch (e){
            console.log(e);
            new Error(e);
        }
    }

}
module.exports=new TripImgsService();