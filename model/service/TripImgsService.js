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

    // 삭제할 이미지 리스트
    async imgList(delImgId) { // 삭제할 이미지 아이디
        let imgList=null;
        let img=null;
        if(delImgId!=null){
            imgList=[];
            if(Array.isArray(delImgId) && delImgId.length > 0) {
                // id 가 배열임을 체크해야하는 이유! 안하면, id 2글자이상인 경우 한자리로 나뉜다.
                // ex) '77' -> id : '7'
                for (const id of delImgId) {
                    img = await tripImgsEntity.findOne({where: {ti_id: id}});
                    imgList.push(img);
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

    // 삭제할 이미지 경로 리스트
    async imgPathList(originImgPath) {
        let imgList=null;
        let img=null;
        if(originImgPath!=null){
            imgList=[];
            if(Array.isArray(originImgPath) && originImgPath.length>0){
                for(const path of originImgPath) {
                    img = await tripImgsEntity.findOne(
                        {where : {
                            img_path  : path
                        }});
                    imgList.push(img);
                    console.log("서비스 _ originImgPath 여러개 img", img);
                    console.log("서비스 _ originImgPath 여러개 imgList", imgList);
                }
            } else {
                img = await tripImgsEntity.findOne(
                    {where : {
                            img_path  : originImgPath
                        }});
                imgList.push(img);
                console.log("서비스 _ originImgPath 1개 img", img);
                console.log("서비스 _ originImgPath 1개 imgList", imgList);
            }
        }
        return imgList;
    }
}
module.exports=new TripImgsService();