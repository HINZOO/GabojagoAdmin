let commsService = require("../../../model/service/CommsService");
const {de} = require("faker/lib/locales");
describe("CommsService Test",()=>{
    test("list Test",async ()=>{
        let list = await commsService.list();
        console.log(list);
        expect(list).not.toBeNull();
    });
});