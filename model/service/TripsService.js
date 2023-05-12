const sequelize = require("../SequelizePool");
const tripsEntity = require("../entity/TripEntity")(sequelize);
// trip 게시글과 해시태그를 조인하기!
const tripHashTagEntity = require("../entity/TripHashTagEntity")(sequelize);
const tripImgsEntity = require("../entity/TripImgsEntity")(sequelize);

const PageVo = require("../vo/PageVo");
const {Op} = require("sequelize");

// trip 게시글 tripHashTag 해시태그 조인 관계 1 : N
// detail 안에서 선언을 하니, detail 을 호출할때마다 실행?이되서 별칭이 중복된다는 에러가 발생
tripsEntity.hasMany(tripHashTagEntity, {
    foreignKey: "t_id", // trip 을 참조하는 tripHashTag 의 외래키
    as: "tags" // tripHashTag 를 불러왔을때, trip 에 생성되는 필드이름
})

tripsEntity.hasMany(tripImgsEntity,{
  foreignKey:"t_id",
  as: "imgs"
})

class TripsService {

    async list(reqParams) {
        try {
            const whereObj = {};
            const orderArr = [];
            if (reqParams.field && reqParams.value) {
                whereObj[reqParams.field] = {[Op.like]: `%${reqParams.value}%`};
            }
            if (reqParams.orderField && reqParams.orderDirect) {
                orderArr.push(reqParams.orderField);
                orderArr.push(reqParams.orderDirect);
            }
            const totalCnt = await tripsEntity.count({
                where: whereObj
            })
            console.log(JSON.stringify(whereObj));
            const pageVo = new PageVo(reqParams.page, totalCnt, reqParams);
            const trips = await tripsEntity.findAll({
                offset: pageVo.offset,
                limit: pageVo.rowLength,
                where: whereObj,
                order: [orderArr]
            })
            trips.pageVo = pageVo;
            return trips;
        } catch (e) {
            new Error(e)
        }
    }

    //상세
    async detail(tId) {
        try {
            const tripId = parseInt(tId); // 파라미터 문자열값 -> 숫자로 형변환
            if (isNaN(tripId)) { // 숫자가 아닌가(NaN인가)?
                return null;
            }
            const trip = await tripsEntity.findOne({
                where: {t_id: tripId}
                ,
                include: [ // 해시태그 실제 조인 (include : 즉시로딩) (지연로딩이 안된다..)
                    {
                        model: tripHashTagEntity, // user 테이블
                        as: "tags",
                        required: false // true : inner Join, false : Left Join
                    }
                    ,
                    {
                        model: tripImgsEntity,
                        as: "imgs",
                        required: false
                    }
                ]
            })
            return trip;
        } catch (e) {
            new Error(e);
        }

    }

    async modify(trip) {
        try {
            let modify = await tripsEntity.update(trip, {where: {t_id: trips.t_id}})
            return modify
        } catch (e) {
            new Error(e);
        }
    }

    async remove(tId) {
        try {
            let del = await tripsEntity.destroy({where: {t_id: tId}})
            return del;
        } catch (e) {
            new Error(e);
        }
    }

    async register(trip) {
        try {
            return tripsEntity.create(trip)
        } catch (e) {
            new Error(e);
        }
    }
}

// module.exports=TripsService;
module.exports = new TripsService();