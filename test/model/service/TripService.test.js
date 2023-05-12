const TripsService=require("../../../model/service/TripsService");
const tripService=TripsService;

describe("tripService test",()=>{
    test("detail join", async()=>{
        const trip=await tripService.detail(1);
        console.log(JSON.stringify(trip,"tripsEntity",2));

        // 해시태그 조인
        const hashTag=await trip.getTags(); // 🍋호출시 조인 (지연로딩)
        console.log(JSON.stringify(hashTag,"tripHashTagEntity",2));

        // 이미지
        const imgs=await trip.getImgs();
        console.log(JSON.stringify(imgs, "tripImgsEntity",2));
    })
})