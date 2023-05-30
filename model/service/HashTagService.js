const sequelize=require("../SequelizePool");
const tripHashtagEntity=require("../entity/TripHashTagEntity")(sequelize);
const hashtagEntity=require("../entity/HashTagEntity")(sequelize);
const {Op} = require("sequelize");

hashtagEntity.belongsTo(tripHashtagEntity, {
    foreignKey: "tag", // hashtag 을 참조하는 tripHashTag 의 외래키
    as: "tripHashtags"
})


class HashTagService {
    async search(tag) {
        try {
            const result = await hashtagEntity.findAll({
                attributes: [ // 결과값을 반환 // attributes 옵션에 객체 형태로 사용
                    // 쿼리 결과를 반환하기 위해 attributes 옵션을 사용하고, sequelize.literal을 사용하여 하위 쿼리를 생성
                    // 하위 쿼리는 trip_hashtags 테이블에서 tag 값이 HashTagEntity.tag와 일치하는 레코드의 개수를 반환 // 🔥hashtags_new.tag 로 하면 안나옴
                    // 반환된 개수는 'bCnt'라는 별칭으로 지정
                    'tag',
                    [
                        sequelize.literal(`( 
                          SELECT COUNT(*) FROM trip_hashtags
                          WHERE trip_hashtags.tag = HashTagEntity.tag
                        )`),
                        'bCnt'
                    ]
                ],
                where: { tag: { [Op.like]: `%${tag}%` } },
                raw: true
            });

            return result;

        } catch (e){
            new Error(e);
            console.error(e);
        }
    }
}
module.exports = new HashTagService();
