const express=require("express");
const fs=require("fs/promises")
const router=express.Router();
const reportsService=require('../model/service/ReportsService');

router.get('/list.do', async (req,res)=>{
    const reports = await reportsService.list();
    res.render("reports/list",{reports:reports});
});

module.exports=router;
