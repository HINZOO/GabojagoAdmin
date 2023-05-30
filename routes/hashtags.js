const express=require('express');
const router=express.Router();
const hashtagService=require('../model/service/HashTagService');

router.get("/:tag/search.do",async (req,res)=>{
    try{
        const tags= await hashtagService.search(req.params.tag);
        res.json(tags);
    }catch (e){
        new Error(e);
        console.error(e);
    }
})

module.exports=router;
