const express=require("express");
const fs=require("fs/promises")
const router=express.Router();
const QnaReplyService=require("../model/service/QnaReplysService");
const qnaReplysService=new QnaReplyService();


router.post("/insert.do",async (req,res)=>{
    const reply=req.body;
    if(!req.body.parent_qna_id)req.body.parent_qna_id=null;
    try{
        insertId=await qnaReplyService.register(reply)
    }catch (e){
        console.error(e);
    }
    res.redirect(`/qnas/${reply.q_id}/detail.do`);
});
router.post("/update.do",async (req,res)=>{
    const reply=req.body;
    let update=0;
    try {
        update=await qnaReplysService(reply)
    }catch (e){
        console.error(e);
    }
    if(update>0){
        try {
            console.log("등록성공")
        }catch (e){
            console.log("등록실패")

        }
        res.redirect(`/qnas/${reply.q_id}/detail.do`);
    }
});
router.get("/:qrId/:qId/delete.do",async (req,res)=>{
   let qrId=req.params.qrId;
   let qId=req.params.qId;

   let del=0;
   try {
       del=await qnaReplysService.remove(qrId);
   }catch (e){
       console.error(e);
   }
   res.redirect(`/qnas/${qId}/detail.do`);
});

module.exports=router;
