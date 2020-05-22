const request = require("supertest");
const {deleteDoctor} = require("../models/doctors");
const {genToken} = require("../models/admins");
var expect = require('chai').expect;

let server;


describe("/api/doctors",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })

    describe("/getDoctor",async()=>{
        it("Should respond with 400 if phone number is missing (validation schema)",async()=>{
            const token = genToken("fawzii","admin");
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400);

        });
        it("Should respond with 401 if not authorized",async()=>{
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .send({phone_number: "01090243795"})
            .expect(401)
        });
        it("Should respond with 401 if doctor not found",async()=>{
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlpZmF3emlfIiwidXNlclJvbGUiOiJhZG1pbiIsImlhdCI6MTU5MDA5MDQ5MywiZXhwIjozMTcxMzQ1MzI4OTN9.y4kGQzcaxTVTkV4F41d1RcJnu3XOkKxpMbHnQZvQBow"
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number: "01090243797"})
            .expect(401);
        });
        it("Should respond with 200 if got doctor successfully",async()=>{
            let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .send({
                "phone_number":"01090113795",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "sub_category":"hala",
                "picture":"fkfjkfj",
                "price": "100",
            })
            .expect(201);
            const token = genToken("fawzii","user");
            res = await request(server)
            .post("/api/doctors/getDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number: "01090113795"})
            .expect(200);
            deleteDoctor("01090113795");
        });
    });

    describe("/getDoctors",async()=>{
        it("Should respond with 401 if not authorized",async()=>{
            let res = await request(server)
            .post("/api/doctors/getDoctors")
            .expect(401)
        });
        it("Should respond with 200 if got doctors successfully",async()=>{
                    const token = genToken("fawziiiiiii","user");
            let res = await request(server)
            .post("/api/doctors/getDoctors")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        });
    })
})