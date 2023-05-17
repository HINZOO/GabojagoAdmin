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

    // 삭제할 이미지 리스트
    async imgList(delImgId) {
        let imgList=null;
        let img=null;
        if(delImgId!=null){
            imgList=[];
            if(Array.isArray(delImgId) && delImgId.length > 0) {
                // id 가 배열임을 체크해야하는 이유! 안하면, id 2글자이상인 경우 한자리로 나뉜다.
                // ex) '77' -> id : '7'
                for (const id of delImgId) {
                    // let img=await tripImgsEntity.findByPk(id);
                    img = await tripImgsEntity.findOne({where: {ti_id: id}});
                    imgList.push(img);
                    // const img = await tripImgsEntity.findOne({where: {ti_id: id}});
                    // console.log("trip 서비스 _ 삭제할 img 상세", img);
                    console.log("서비스 _ delImgId 여러개 img", img);
                    console.log("서비스 _ delImgId 여러개 imgList", imgList);
                }
            } else {
                img = await tripImgsEntity.findOne({where: {ti_id: delImgId}});
                imgList.push(img);
                console.log("서비스 _ delImgId 1개 img", img);
                console.log("서비스 _ delImgId 1개 imgList", imgList);
            }
        }
        return imgList;
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

    async modify(trip,imgs) { // imgs : 라우터 req.files (업로드한 이미지 파일)
        try {
            let modify = await tripsEntity.update(
                trip,
                {where: {t_id: trip.t_id}}
            )
            const imgPaths=[];
            for(const img of imgs) {
                console.log("img.filename",img.filename);
                console.log("img.path",img.path);
                modify+=await tripImgsEntity.create({ // db 에 이미지 추가
                    t_id: trip.t_id,
                    img_path: "/" + img.path, // img.path : public/img/trip/trip_1684137090730_55.jpeg
                    img_main: false
                })
                imgPaths.push("/"+img.path);
                trip.img_path=imgPaths;
            }

            // delImgId == ti_id 삭제
            if(trip.delImgId!=null) {
                if(Array.isArray(trip.delImgId) && trip.delImgId.length > 0){
                    for (const id of trip.delImgId) { // id 가 한개인경우 '53' => '5','3'
                        modify += await tripImgsEntity.destroy({where: {ti_id: id}}); // db 이미지 삭제
                    }
                } else {
                    modify+=await tripImgsEntity.destroy({where:{ti_id: trip.delImgId}});
                }
            }
            console.log("modify", modify);
            console.log("imgs",imgs);
            console.log("trip", trip);
            console.log("trip.t_id", trip.t_id);
            return modify;
        } catch (e) {
            new Error(e);
            console.log(e);
        }
    }


    async remove(tId) {
        try {
            let del = await tripsEntity.destroy({where: {t_id: tId}})

            console.log("trip",trip);
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