const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");

let server;

describe("/api/messages",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })


    describe("/getFinishedMessages",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/messages/getFinishedMessages")
            .expect(401);
        });
        it("Should respond with 400 if room_id is missed", async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .post("/api/messages/getFinishedMessages")
            .set("Authorization", `Bearer ${token}`)
            .send({room_id: 1591470036382}) // should be a string not number
            .expect(400);
        })
        it("Should respond 200 if got messages successfully",async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .post("/api/messages/getFinishedMessages")
            .set("Authorization", `Bearer ${token}`)
            .send({room_id: "1591470036382"}) 
            .expect(200);
        });
    })
});