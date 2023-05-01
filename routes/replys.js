const express=require("express");
const fs=require("fs/promises")
const router=express.Router();
const qnaReplysService=require("../model/service/QnaReplysService");
const qnaService = require("../model/service/QnasService");
const {tr} = require("faker/lib/locales");
router.get('/list.do', async (req,res)=>{
    req.query.page = parseInt(req.query.page) || 1;
    req.query.orderField = req.query.orderField || "post_time";
    req.query.orderDirect = req.query.orderDirect || "DESC";
    console.log(qna.replys)
    const replys=await qnaReplysService.list(req.query);
    res.render("/qnas/replys/list",{replys:replys,params:replys})
});

router.post("/insert.do",async (req,res)=>{
    const replys=req.body;

    let insert=0
    try {
        const qnas={status:1,q_id:replys.q_id};
        insert+=await qnaService.modify(qnas)
        insert+=await qnaReplysService.register(replys)
        //원래 글 의 상태를 변경
    }catch (e) {
        console.error(e);
    }
    res.redirect(`/qnas/${replys.q_id}/detail.do`);
    });

        router.post("/update.do",async (req,res)=>{
        const replys=req.body;
        let update=0;
        try {
            update=await qnaReplysService.modify(replys)
        }catch (e){
            console.error(e);
        }
        if(update>0){
            try {
                update=await qnaReplysService.register(replys)
            }catch (e){
                console.error(e)
            }
            res.redirect(`/qnas/${replys.q_id}/detail.do`);
        }
    });
    router.get("/:qrId/:qId/delete.do",async (req,res)=>{
        let qrId=req.params.qrId;
        let qId=req.params.qId;
        let del=0;
        if(del>0)
            try {
                del=await qnaReplysService.remove(qrId);
            }catch (e){
                console.error(e);
            }
        console.log(del)

        res.redirect(`/qnas/${qId}/detail.do`);
    });
    module.exports=router;
