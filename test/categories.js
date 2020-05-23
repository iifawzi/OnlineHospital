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
            let res = request(server)
            .post("/api/categories/getCategories")
            .expect(400);
        })
    })
});