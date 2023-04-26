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



router.get('/list.do', async function(req, res, next) {
  let permission=req.query.permission;
  let page=parseInt(req.query.page) || 1 ;
  const users=await userService.list(permission,1);
  res.render("users/list",{users:users,params:req.query});
});

router.get('/:uId/detail.do',async (req,res)=>{
  const user=await userService.detail(req.params.uId);
  if(user){
    res.render("users/detail",{user:user})
  }else{
    res.redirect("/users/list.do");
  }
});

router.get('/:uId/update.do',async (req,res)=>{
  const user=await userService.detail(req.params.uId);
  if(user){
    res.render("users/update",{user:user})
  }else{
    res.redirect(`/${req.params.uId}/detail.do`);//여기 파라미터 안넘어감..
  }
});
module.exports=router;