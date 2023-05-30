const sequelize = require("../SequelizePool");
const tripsEntity = require("../entity/TripEntity")(sequelize);
// trip 게시글과 해시태그를 조인하기!
const tripHashTagEntity = require("../entity/TripHashTagEntity")(sequelize);
const tripImgsEntity = require("../entity/TripImgsEntity")(sequelize);
const hashTagEntity = require("../entity/HashTagEntity")(sequelize);

const PageVo = require("../vo/PageVo");
const {Op} = require("sequelize");

// trip 게시글 tripHashTag 해시태그 조인 관계 1 : N
// detail 안에서 선언을 하니, detail 을 호출할 때마다 실행? 이되서 별칭이 중복된다는 에러가 발생 => detail 서비스 바깥에서 선언
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
            if (isNaN(tripId)) { // 숫자가 아닌가(NaN인가)? 숫자가 아니면 true
                return null;
            }
            const trip = await tripsEntity.findOne({
                where: {t_id: tripId}
                ,
                include: [ // 해시태그 실제 조인 (include : 즉시로딩) (지연로딩이 안된다..)
                    {   model: tripHashTagEntity, // user 테이블
                        as: "tags",
                        required: false // true : inner Join, false : Left Join
                    }
                    ,
                    {   model: tripImgsEntity,
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
        let modify = 0;

        try {
            modify += await tripsEntity.update(
                trip,
                {where: {t_id: trip.t_id}}
            );
            // 🍌00 -> await 결과를 parseInt 함수이용해서 문자열 '0' => 정수로 변경 => 0
            console.log("서비스 trip 수정 modify",modify);
            // 👀imgs 가 없는 경우 null 처리하기!
            // 🍒 이미지 등록 & 삭제
            if(!imgs) imgs=null;
            const mainImg = imgs.mainImg;
            const subImgs = imgs.img;
            const imgPaths = [];

            // 메인이미지 등록시 기존 이미지 수정 update
            if(mainImg!=null) {
                // ✨메인이미지 등록시 db 기존 메인이미지의 이미지경로 수정
                modify+= await tripImgsEntity.update(
                    {img_path: "/" + mainImg[0].path},
                    {where : {t_id: trip.t_id, img_main: true}}
                );
                console.log("서비스 메인이미지 modify", modify);
                imgPaths.push("/"+mainImg[0].path);
                console.log("서비스 메인이미지 mainImg", mainImg[0]);
                console.log("서비스 메인이미지 mainImg.path", mainImg[0].path);
                console.log("서비스 메인이미지 imgPaths", imgPaths);
            }
             console.log("서비스 mainImg", mainImg);

            // 서브이미지 파일 등록시 db 이미지 추가 create
            if(subImgs!=null) {
                for(const subImg of subImgs) {
                    console.log("서비스 subImg", subImg);
                    console.log("서비스 subImgs", subImgs);
                    const dbSubImg = await tripImgsEntity.create({
                        t_id: trip.t_id,
                        img_path: "/" + subImg.path,
                        img_main: false
                    }) // 👀 create 의 반환값은 생성된 객체 => 생성의 성공여부 0, 1 이 아니다!! => 생성된 객체임
                    console.log("trip 서비스_서브이미지 db 등록성공 create", dbSubImg);
                    if(dbSubImg!=null) { // create 로 이미지가 생성이 성공되면 값이 null 이 아니다!!
                        modify+=1; // 이때 생성이 성공된 것을 modify 에 1을 더해준다!
                    }
                    imgPaths.push("/"+subImg.path);
                    console.log("서비스 서브이미지 등록 modify",modify);
                    console.log("서비스 서브이미지 imgPaths", imgPaths);
                }
            }
            trip.img_path=imgPaths;

            if(trip.delImgId!=null) {
                if(Array.isArray(trip.delImgId) && trip.delImgId.length > 0){
                    for (const id of trip.delImgId) { // id 가 한개인경우 '53' => '5','3'
                        modify += await tripImgsEntity.destroy({where: {ti_id: id}}); // db 이미지 삭제
                    }
                } else {
                    modify+=await tripImgsEntity.destroy({where:{ti_id: trip.delImgId}});
                }
            }

            // 해시태그 등록 함수 _ 중복코드
            async function createHashTag(tag) {
                const hashTag = await hashTagEntity.findOne({ where: { tag: tag } });
                if (hashTag == null) {
                    const newHashTag = await hashTagEntity.create({ tag: tag });
                    if (newHashTag != null) modify += 1;
                }
                const tripHashTag = tripHashTagEntity.create({
                    t_id: trip.t_id,
                    tag: tag
                })
                if(tripHashTag!=null) modify+=1;
            }

            async function deleteHashTag(delTag) {
                await tripHashTagEntity.destroy({
                    where: {
                        t_id : trip.t_id,
                        tag: delTag
                    }
                })
                modify+=1;
            }

            const tags=trip.tag;
            const delTags=trip.delTag;

            // 🍒 해시태그  db 등록 & 삭제
            if(tags!=null) {
                if(Array.isArray(tags) && tags.length > 0) { // 배열인 경우
                    for(const tag of tags) { // 반복문
                        // 해시태그 1개 등록인 경우 "제주반려" -> '제','주','반','려' 로 등록됨
                        // 1개 등록 시 등록처리 로직 추가
                        await createHashTag(tag);
                    }
                } else { // 배열이 아닌 경우
                    const tag = tags;
                    await createHashTag(tag);
                }
            }

            if(delTags!=null) {
                if(Array.isArray(delTags) && delTags.length > 0) {
                    for(const delTag of delTags) {
                        await deleteHashTag(delTag);
                    }
                } else {
                    const delTag = delTags;
                    await deleteHashTag(delTag);
                }
            }

            return modify;

        } catch (e) {
            console.error(e);
            new Error(e);
            console.log(e);
        }
    }


    async remove(tId) {
        console.log("서비스 tId",tId);
        try {
            let del = await tripsEntity.destroy({where: {t_id: tId}})
            console.log("서비스 del", del)
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

module.exports = new TripsService();