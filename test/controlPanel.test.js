const request = require("supertest");
const {deleteDoctor} = require("../models/doctors");

let server;


describe("/api/controlPanel",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })



    describe("/addingDoctor",async()=>{
        it("Should respond with 400 if one of inpus is missed or incorrect (SCHEMA VALIDATION)",async()=>{
            const res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .expect(400);
        });
        it("Should respond with 201 if doctor created successfully",async()=>{
            let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .send({
                "phone_number":"01090243795",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "sub_category":"hala"
            })
            .expect(201);
            deleteDoctor("01090243795");
        });
        it("Should respond with 403 if the phone number is already registered",async()=>{
            let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .send({
                "phone_number":"01090243795",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "sub_category":"hala"
            })
            .expect(201);
            res = request(server)
            .post("/api/controlPanel/addDoctor")
            .send({
                "phone_number":"01090243795",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "sub_category":"hala"
            })
            .expect(403);
            deleteDoctor("01090243795");
        })
    })
})