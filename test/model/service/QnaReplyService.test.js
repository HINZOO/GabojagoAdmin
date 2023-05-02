
let qnaReplysService = require("../../../model/service/QnaReplysService");
const {de} = require("faker/lib/locales");
describe("UserService Test",()=>{

    test("remove Test",async ()=>{
        let remove = await qnaReplysService.remove("3");
        console.log(remove);
        expect(remove).toBe(1);
    });

});