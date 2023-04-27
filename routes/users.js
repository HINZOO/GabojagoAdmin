const express = require('express');
const router = express.Router();
const userService=require('../model/service/UsersService');

router.get("/login.do",(req,res)=>{
  res.render("users/login");
});

router.post("/login.do",async (req,res)=>{
  let {u_id,pw,autoLogin}=req.body;//아이디,비번,자동로그인 값을 바디에 요청
  let user=null;
  if(u_id&&pw){
    user=await userService.login(u_id,pw);
  }
  if(user){//로그인성공
    req.session.loginUser=user; //세션에 저장
    const cookieOpt={
      httpOnly:true,//http 통신에만 쿠키사용(탈취해킹방지)
      signed:true,//암호화
      maxAge:7*24*60*60*1000//만료시간
    }
    if(autoLogin && autoLogin==="1"){
      res.cookie("autoLoginId",user.u_id,cookieOpt);
      res.cookie("autoLoginPw",user.pw,cookieOpt);
    }
    res.redirect("/");
  }else{
    res.redirect("users/login.do");
  }
   res.end();
})


//📁 리스트 출력
router.get('/list.do', async function(req, res) {
  req.query.page = parseInt(req.query.page) || 1;
  req.query.orderField = req.query.orderField || "post_time";
  req.query.orderDirect = req.query.orderDirect || "DESC";
  let users=null;
  try {
    users=await userService.list(req.query);
  }catch (e) {
    new Error(e);
    //req.flash("actionMsg","검색 실패:"+e.message);
  }
  if(users){
    res.render("users/list",{users:users,params:req.query});
  }else {
    res.redirect("/users/list.do")
  }
});
//📁 회원상세
router.get('/:uId/detail.do',async (req,res)=>{
  const user=await userService.detail(req.params.uId);
  if(user){
    res.render("users/detail",{user:user})
  }else{
    res.redirect("/users/list.do");
  }
});

//📁 회원수정
router.get('/:uId/update.do',async (req,res)=>{
  const user=await userService.detail(req.params.uId);
  if(user){
    res.render("users/update",{user:user})
  }else{
    res.redirect(`/${req.params.uId}/detail.do`);//여기 파라미터 안넘어감..
  }
});
module.exports=router;