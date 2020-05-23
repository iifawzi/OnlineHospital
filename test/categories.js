const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");

var expect = require('chai').expect;

let server;

describe("/api/categories",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })



    describe("/getCategories",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/categories/getCategories")
            .expect(401);
        });
        it("Should respond 200 if got categories successfully",async()=>{
            const token = genToken("0109034748","user");
            let res = await request(server)
            .post("/api/categories/getCategories")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        });
    })
});