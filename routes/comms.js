const express = require('express');
const router = express.Router();
const commsService=require("../model/service/CommsService");
router.get('/list.do', async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";

    const comms=await commsService.list(req.query)
    res.render("boards/commList",{comms:comms,params:req.query});
});

router.get("/:cId/delete.do",async (req,res)=>{
    let del=0;
    try{
        del=await commsService.remove(req.params.cId);
    }catch (e){
        console.error(e);
    }
    if(del>0){
        res.redirect("/comms/list.do")
    }else{
        res.redirect(`/comms/${req.params.cId}/detail.do`);
    }
})


module.exports=router;