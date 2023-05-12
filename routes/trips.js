const express = require('express');
const router = express.Router();
const tripsService=require("../model/service/TripsService")
router.get('/list.do', async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";

    const trips=await tripsService.list(req.query)
    res.render("boards/tripList",{trips:trips,params:req.query});
});

// 상세
router.get('/:tId/detail.do',async(req,res)=>{
   const trip=await tripsService.detail(req.params.tId);
    console.log("trip 안나와?",trip)

   if(trip){
       res.render("boards/tripDetail",{trip:trip,params:req.query})
   }else {
       res.redirect("/trips/list.do");
   }

});


// 수정
router.get('/:tId/update.do', async(req,res)=>{
    const trip=await tripsService.detail(req.params.tId);
    if(trip) {
        res.render("boards/tripUpdate",{trip:trip})
    }else{
        res.redirect(`/trips/${req.params.tId}/detail.do`);
    }
})


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


module.exports=router;