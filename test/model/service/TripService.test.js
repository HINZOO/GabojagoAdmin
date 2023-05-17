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
        const user={
            "u_id": "USER02",
            "pw": "1234",
            "name": "김영수수정",
            "nk_name": "영수수정",
            "email": "kimyoungsoo수정@gmail.com",
            "birth": "1986-05-25",
            "phone": "010-1111-3333",
            "address": "서울특별시 수정구",
            "detail_address": "수정동동 123-1",
            "pr_content": "안녕하세요. 저는 웹 개발자 수정 입니다.",
            "permission": "USER",
            "mbti": "ISFJ",
            "img_path": "/public/img/user/1.jpg",
            "post_time": "2023-04-14 14:07:01",
            "store_name": "바보스토어2222",
            "business_id": "1"
        }
        let modify = await usersService.modify(user);
        console.log(modify);
        expect(modify[0]).toBe(1);
    });
    test("update", async()=>{
        const trip={

        }
    })

})