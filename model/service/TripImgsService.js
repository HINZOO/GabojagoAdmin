const sequelize=require("../SequelizePool");
const tripImgsEntity = require("../entity/TripImgsEntity")(sequelize);

class TripImgsService {
    async detail(tiId){
        try {

            const tripImg=await tripImgsEntity.findOne({
                where: {ti_id : tiId}
            })
            return tripImg;
        }catch (e){
            console.log(e);
            new Error(e);
        }
    }
}
module.exports=new TripImgsService();