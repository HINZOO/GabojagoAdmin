const express = require("express");
const router = express.Router();
const tripsService=require("../model/service/TripsService")
const tripImgsService=require("../model/service/TripImgsService");
const {Logger} = require("sequelize/lib/utils/logger");
const fs = require("fs/promises");
const path=require("path");

// 이미지업로드 multer 미들웨어
const multer=require("multer");
const qnaService = require("../model/service/QnasService");

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
// router.post("/update.do", upload.array("img",5), async(req,res)=>{
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


    /* // 🍒db 수정 실패시 업로드한 이미지 삭제 req.files 의 img_path 삭제하기 테스트
    if(imgs!=null){
        for(const img of imgs){
            console.log("trip 라우터 업로드 img",img);
            console.log("trip 라우터 업로드 img.path", img.path);
        }
    }*/

    // 메인이미지가 있을때
    // 서브이미지가 없으면 => 배열만들어서, 메인이미지 추가하기
    // 삭제할 서브이미지가 없으면 => 배열 만들어서, 삭제할 메인이미지 추가하기
    // 메인이미지 상태설정 -> true

    let update=0;
    let delImgs=null;

    try {
        // 삭제하려고 체크한 이미지가 있다면
        // modify 서비스에서 db 삭제하기 전에 해당하는 이미지 리스트를 저장해두기
        if(trip.delImgId!=null) {
            delImgs=await tripsService.imgList(trip.delImgId);
            console.log("trip 라우터 delImgs",delImgs)
        }
        update=await tripsService.modify(trip,imgs); // imgs : mainImg [], img []

    }catch (e) {
        console.error(e);
    }
    console.log("라우터 trip", trip);
    console.log("update", update);

    // 수정이 성공하고 (db 삭제 또는 추가) => 파일 삭제 또는 추가
    // db 추가(update>0)(서비스에서) => 파일추가(라우터) (ok)
    // db 삭제(update>0)(서비스에서) => 파일삭제(라우터)

    // 삭제할 이미지 체크 delImgId -> 실행 -> delImgId 사라짐
    // 그러면 delImgId 가 없어지고 나서, 어떻게 delImgId 에 해당되는 이미지 경로의 실제 파일을 삭제할 것인가
    // db 에서 삭제하기전에 delImgId 에 해당되는 이미지 경로를 변수에 담아놓고 => tripService 에 imgList 서비스 만들기
    // db 삭제 성공하면 이후에 해당 경로를 파일 삭제하기

    if(update>0){ // db 수정 성공!
        console.log("수정 성공");
        // 삭제하려는 이미지가 있는 경우 => 실제 파일 삭제
        if(delImgs!=null) {
            // delImgs 가 배열임을 체크안해도, delImgs 가 1개인 경우에도 반복문 작동에 이상없음
            for(const img of delImgs){
                console.log("trip 라우터 삭제할 img", img);
                console.log("trip 라우터 삭제할 delImgs", delImgs);
                console.log("img.img_path", img.img_path);
                await fs.unlink("."+img.img_path); // /public/img/trip/trip_1684334934491_265.jpg'
            }
        }
        // 메인이미지 등록한 경우 => 기존 메인이미지 파일 삭제
        // 메인이미지가 2개가 되면, 첫번째 파일은 삭제?
        if(trip.delMainImgId.length>0) {
        // if(mainImg.length>0) {
            console.log("라우터 메인이미지 등록 mainImg", mainImg);
            // await fs.unlink("/"+mainImg[0].path);
        }
    }
    else{ // db 수정 실패시 업로드한 이미지 삭제
        try { // req.files 의 img_path 삭제하기
            if(imgs!=null){
                if(subImgs!=null){
                    for(const subImg of subImgs) {
                        console.log("라우터 subImg", subImg);
                        await fs.unlink("."+subImg.path);
                    }
                } else if (mainImg!=null) {
                    console.log("라우터 mainImg", mainImg);
                    // await fs.unlink("./"+mainImg[0].path);
                }




                // for(const img of imgs){
                //     console.log("trip 라우터 업로드 img",img);
                //     console.log("trip 라우터 업로드 img.path", img.path);
                //     await fs.unlink("."+img.path);
                // }
            }
        }catch (e) {
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
    console.log("trip 안나와?",trip)

   if(trip){
       res.render("boards/tripDetail",{trip:trip,params:req.query})
   }else {
       res.redirect("/trips/list.do");
   }

});




router.get("/:tId/delete.do",async (req,res)=>{
    let del=0;
    try{
        del=await tripsService.remove(req.params.tId);
    }catch (e){
        console.error(e);
    }
    if(del>0){
        res.redirect("/trips/list.do")
    }else{
        res.redirect(`/trips/${req.params.tId}/detail.do`);
    }
})

function nullifValues(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = (value === null || value === undefined ) ? null : value;
        // result[key] = (value === null || value === undefined || value.trim() === '') ? null : value;
    }
    return result;
}

module.exports=router;