let usersService = require("../../../model/service/UsersService");
const {de} = require("faker/lib/locales");
describe("UserService Test",()=>{
    test("list Test",async ()=>{
        let list = await usersService.list("USER",1);
        console.log(list);
        expect(list).not.toBeNull();
    });
    test("detail Test",async ()=>{
        let detail = await usersService.detail("USER02");
        console.log( await detail.getFollows());
        console.log( await detail.getFollowings());
        expect(detail).not.toBeNull();
    });
    test("login Test",async ()=>{
        let detail = await usersService.login("USER02","1234");
        console.log(detail);
        expect(detail).not.toBeNull();
    });
    test("permissionModify Test",async ()=>{
        let modify = await usersService.permissionModify("USER03","PARTNER");
        console.log(modify[0]);
        expect(modify[0]).toBe(1);
    });
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
    test("register Test",async ()=>{
        const user={
            "u_id": "test00",
            "pw": "1234",
            "name": "김영수수정",
            "nk_name": "영수수정",
            "email": "kimyoungsoo테스트@gmail.com",
            "birth": "1986-05-25",
            "phone": "999-3333-3333",
            "address": "서울특별시 수정구",
            "detail_address": "수정동동 123-1",
            "pr_content": "안녕하세요. 저는 웹 개발자 수정 입니다.",
            "permission": "USER",
            "mbti": "ISFJ",
            "img_path": "/public/img/user/1.jpg",
            "store_name": null,
            "business_id": null
        }
        let insertUser;
        try {
            insertUser = await usersService.register(user);
        }catch (e) {
            console.error(e);
        }
        console.log(insertUser);
        expect(insertUser).not.toBeNull();
    });
    test("remove Test",async ()=>{
        let remove = await usersService.remove("test00");
        console.log(remove);
        expect(remove).toBe(1);
    });

});