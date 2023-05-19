const TripsService=require("../../../model/service/TripsService");
const usersService = require("../../../model/service/UsersService");
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


    test("modify Test",async ()=>{
        const trip={
            "t_id": "1",
            "category" : "힐링",
            "delMainImgId" : ['23','124'],
            "img_path" : [ '/public/img/trip/trip_1684337891120_682.jpg' ],
            "origin_img_path": [
                '/public/img/trip/1682993319728_4765.jpeg',
                '/public/img/trip/trip_1684334934487_682.jpg',
                '/public/img/trip/trip_1684337891120_682.jpg',
                '/public/img/trip/trip_1684337891121_39.jpeg',
                '/public/img/trip/trip_1684338059604_379.jpg',
                '/public/img/trip/trip_1684472985413_67.jpg'
            ]
        }
        const imgs = {

        }
        let modify = await usersService.modify(trip,imgs);
        console.log(modify);
        expect(modify[0]).toBe(1);
    });
    test("update", async()=>{
        const trip={

        }
    })

})