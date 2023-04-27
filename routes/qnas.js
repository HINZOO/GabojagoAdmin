const express = require('express');
const router = express.Router();
const qnaService=require('../model/service/QnasService');

router.get('/list.do', async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";

     const qnas=await qnaService.list(req.query);
    res.render("qnas/list",{qna:qnas,params:req.query});
});

module.exports=router;

