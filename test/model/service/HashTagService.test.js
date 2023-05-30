const HashTagService=require("../../../model/service/HashTagService")
const hashTagService=HashTagService;
const hashTagEntity=require("../../../model/entity/HashTagEntity");

describe("hashTagService test", ()=>{
    test("list", async()=>{
        const tags = await hashTagService.search("홍대");
        console.log("tags",tags);
    })
})
