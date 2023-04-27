const express = require('express');
const router = express.Router();
const qnaService=require('../model/service/QnasService');
const userService = require("../model/service/UsersService");

router.get('/list.do', async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";

     const qnas=await qnaService.list(req.query);
    res.render("qnas/list",{qnas:qnas,params:req.query});
});

router.get('/:qId/detail.do',async (req,res)=>{
    const qna=await qnaService.detail(req.params.qId);
    if(qna){
        res.render("qnas/detail",{qna:qna,params:req.query})
    }else{
        res.redirect("/qnas/list.do");
    }
});
router.get("/:qId/delete.do",async(req,res)=>{
    let del=0
    let errMsg="";
    try{
        del=await qnaService.remove(req.params.qId)

    }catch(e){
        console.error(e)
        errMsg=e.message
    }
    if(del>0){
        res.redirect("/qnas/list.do")
    }else{
        res.redirect("/qnas/list.do")
    }
})

module.exports=router;

