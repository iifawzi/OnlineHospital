const request = require("supertest");
var expect = require('chai').expect;

let server;


describe("/api/doctors",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })

    describe("/getDoctor",async()=>{
        it("Should respond with 401 if not authorized",async()=>{
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .send({phone_number: "01090243795"})
            .expect(401)
        });
        it("Should respond with 400 if phone number is missing (validation schema)",async()=>{
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlpZmF3emlfIiwidXNlclJvbGUiOiJhZG1pbiIsImlhdCI6MTU5MDA5MDQ5MywiZXhwIjozMTcxMzQ1MzI4OTN9.y4kGQzcaxTVTkV4F41d1RcJnu3XOkKxpMbHnQZvQBow"
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({})
            .expect(400)
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
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlpZmF3emlfIiwidXNlclJvbGUiOiJhZG1pbiIsImlhdCI6MTU5MDA5MDQ5MywiZXhwIjozMTcxMzQ1MzI4OTN9.y4kGQzcaxTVTkV4F41d1RcJnu3XOkKxpMbHnQZvQBow"
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number: "01090243799"})
            .expect(200);
        });
    });

    describe("/getDoctors",async()=>{
        it("Should respond with 401 if not authorized",async()=>{
            let res = await request(server)
            .post("/api/doctors/getDoctors")
            .expect(401)
        });
        it("Should respond with 200 if got doctors successfully",async()=>{
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlpZmF3emlfIiwidXNlclJvbGUiOiJhZG1pbiIsImlhdCI6MTU5MDA5MDQ5MywiZXhwIjozMTcxMzQ1MzI4OTN9.y4kGQzcaxTVTkV4F41d1RcJnu3XOkKxpMbHnQZvQBow"
            let res = await request(server)
            .post("/api/doctors/getDoctors")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        });
    })
})