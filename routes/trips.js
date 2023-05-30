const express = require("express");
const router = express.Router();
const tripsService=require("../model/service/TripsService")
const tripImgsService=require("../model/service/TripImgsService");
const {Logger} = require("sequelize/lib/utils/logger");
const fs = require("fs/promises");
const path=require("path");
// 이미지업로드 multer 미들웨어
const multer=require("multer");

const storage=multer.diskStorage(
    {
        // 서버에 파일이 저장될 경로를 지정
        //cb : destination의 값을 지정
        destination:(req,file,cb)=>{ // 요청객체, 업로드된 파일객체, 콜백함수
            cb(null,"./public/img/trip"); // 에러객체, 파일이 저장될 경로 문자열
        },
        // 서버에 저장될 때 파일의 이름을 지정
        filename:(req,file,cb)=>{
            // 업로드된 파일 확장자를 추출하여 변수에 저장
            let ext=path.extname(file.originalname);
            // 현재시간_랜덤숫자 파일 고유이름 생성
            let name="trip_"+Date.now()+"_"+(Math.trunc(Math.random()*1000))+ext; //.jpeg
            req.body.img_path="/img/trip/"+name;
            cb(null,name);
        }
    }
);

// 이미지 받았을 때 필터링
function fileFilter (req, file, cb)  {
    let mimetype=file.mimetype.split("/");
    if (mimetype[0]!=="image"){
        return cb(new Error("이미지만 업로드 가능합니다."), false);
    }
    cb(null, true);
};

// 파일업로드를 처리하는 객체 // storage 는 위에서 정의한 multer.diskStorage
const upload=multer({storage:storage,fileFilter:fileFilter});

// 수정페이지 상세
router.get("/:tId/update.do",async(req,res)=>{
    const trip=await tripsService.detail(req.params.tId);
    if(trip) {
        res.render("boards/tripUpdate",{trip:trip})
    }else{
        res.redirect(`/trips/${req.params.tId}/detail.do`);
    }
})

// 수정페이지 처리
router.post("/update.do", upload.fields([{name: "mainImg", maxCount: 1}, {name: "img", maxCount: 5}]), async(req,res)=>{
    console.log("req.file",req.files); // img 로 업로드한 이미지들 // img 는 이미지 업로드 input name
    console.log("req.body",req.body); // POST 요청에서 전달된 데이터를 처리하기 위해 req.body 객체를 추출합니다. //post 방식으로 보내는 파라미터

    // if(!a) => Falsy한 값 // JavaScript에서 false, null, undefined, 0, 빈 문자열(''), NaN..
    // 업로드한 이미지 없을때는 기존이미지들을 img_path 에
    if(!req.body.img_path)req.body.img_path=null; // 업로드한 이미지 없을 때
    req.body.t_id=Number(req.body.t_id);

    const imgs = req.files; // 서브 이미지 파일들 // mainImg:[{  }], img:[{  }]
    const trip=req.body;
    const mainImg = imgs.mainImg;
    const subImgs = imgs.img;

    // mbti 체크
    const keys = ['istj', 'istp', 'isfj', 'isfp', 'intj', 'intp', 'infj', 'infp', 'estj', 'estp', 'esfj', 'esfp', 'entj', 'entp', 'enfj', 'enfp'];
    // 🍒Pug 템플릿에서 체크박스의 체크 여부를 'on' 으로 표시하기 때문에(req.body 에 'on' 으로 넘어옴) 값을 1로 변환
    keys.forEach(key => {
        if(trip[key] === 'on') {
            trip[key] = true;
        } else {
            trip[key] = false; // 🍒아닌 경우 반드시 false 정의 해야지 pug 템플릿에서 체크박스 체크안됨
        }
    });

    let update=0;
    let delImgs=null;

    // 기존 메인이미지
    const originMainImg = await tripImgsService.detail(trip.delMainImgId);
    let originMainImgPath = "." + originMainImg.img_path;
    console.log("라우터 기존메인이미지 originMainImg", originMainImg.img_path); //  /public/img/trip/trip_1684482288206_94.jpg

    try {
        // 삭제하려고 체크한 이미지가 있다면
        // modify 서비스에서 db 삭제하기 전에 해당하는 이미지 리스트를 저장해두기
        if(trip.delImgId!=null) {
            delImgs=await tripImgsService.imgList(trip.delImgId);
            console.log("trip 라우터 delImgs",delImgs)
        }
        update=await tripsService.modify(trip,imgs); // db 삭제,수정.. // imgs : mainImg [], img []
    }catch (e) {
        console.error(e);
    }
    console.log("라우터 trip", trip);
    console.log("update", update);

    if(update>0){ // db 수정 성공!
        console.log("수정 성공");
        // 삭제하려는 서브 이미지가 있는 경우 => 👀실제 파일 삭제
        if(delImgs!=null) {
            for(const img of delImgs){ // delImgs 가 배열임을 체크안해도, delImgs 가 1개인 경우에도 반복문 작동에 이상없음
                console.log("trip 라우터 삭제할 img", img);
                console.log("trip 라우터 삭제할 delImgs", delImgs);
                console.log("img.img_path", img.img_path);
                await fs.unlink("."+img.img_path); // /public/img/trip/trip_1684334934491_265.jpg'
            }
        }
        // 메인이미지 등록한 경우 => 👀기존 메인이미지 실제 파일 경로 수정
        // 업로드(modify)하기 전 기존메인이미지의 파일경로를 보관하고 있어야 한다 => originMainImg 변수선언
        if(mainImg) { // 새로등록한 메인이미지 있으면
            const newPath = "./"+mainImg[0].path
            // 기존 메인이미지 실제파일 삭제
            await fs.unlink(originMainImgPath, async (err)=>{
                if(err) {
                    console.error("기존 메인이미지 파일삭제 실패", err);
                } else { // 새로등록한 메인이미지 경로로 실제파일 경로 변경하기
                    await fs.rename(newPath, originMainImgPath, (err)=>{
                       if(err){
                           console.error("이미지 파일 변경실패",err);
                       } else {
                           console.log("이미지 파일 변경 성공")
                       }
                    });
                }
            });
        }
    } // -- update>0
    else{ // db 수정 실패시 업로드한 이미지 삭제
        try { // req.files 의 img_path 삭제하기
            if(imgs!=null){
                if(subImgs!=null){
                    for(const subImg of subImgs) {
                        console.log("라우터 subImg", subImg);
                        await fs.unlink("./"+subImg.path);
                    }
                } else if (mainImg!=null) {
                    console.log("라우터 mainImg", mainImg);
                    await fs.unlink("./"+mainImg[0].path);
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    res.redirect(`/trips/${trip.t_id}/detail.do`);

})


router.get("/list.do", async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";

    const trips=await tripsService.list(req.query)
    res.render("boards/tripList",{trips:trips,params:req.query});
});

// 상세
router.get("/:tId/detail.do",async(req,res)=>{
   const trip=await tripsService.detail(req.params.tId);

   if(trip){
       res.render("boards/tripDetail",{trip:trip,params:req.query})
   }else {
       res.redirect("/trips/list.do");
   }

});


router.get("/:tId/delete.do",async (req,res)=>{
    let del=0;
    let delImgs=[];
    // 🍎req.params => { tId: '5'} 객체 형태로 tId 를 가지고 있다
    const tId = req.params.tId;
    const trip = await tripsService.detail(tId);
    console.log("tId",req.params.tId);
    console.log("trip",trip);
    console.log("tripImgs",trip.imgs);
    const imgs=trip.imgs; // 복수
    let delImgObj;

    if(imgs!=null){
        for(const img of imgs) {
            const imgPath=img.img_path;
            console.log("imgPath",imgPath); //  /public/img/trip/1682993272526_8304.jpeg
            delImgs.push(imgPath);
        }
            console.log("delImgs",delImgs);
    }

    try{
        delImgObj = await tripImgsService.imgPathList(delImgs); // 이미지 경로를 이용한 이미지 객체를 저장
        console.log("삭제 delImgObj",delImgObj);
        del=await tripsService.remove(tId); // db 삭제
        console.log("del",del);
    }catch (e){
        console.error(e);
    }
    if(del>0){ // db 삭제 성공시, 실제 이미지 파일 삭제하기
        if(delImgObj!=null) {
            for (const delImg of delImgObj) {
                console.log("delImg",delImg);
                console.log("delImg img_path",delImg.img_path); // /public/img/trip/1685198954428_953.jpeg
                try {
                    await fs.unlink("."+delImg.img_path);
                    console.log("이미지파일 삭제", delImg.img_path);
                } catch(e) {
                    console.error("이미지파일 삭제실패:", delImg.img_path);
                    console.error(e);
                }
            }
        }
    }
    res.redirect("/trips/list.do");

})

module.exports=router;