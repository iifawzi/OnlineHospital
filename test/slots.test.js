const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");
const {deleteDoctor} = require("../models/doctors");

var expect = require('chai').expect;

let server;

describe("/api/slots",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })



    describe("/addSlot",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            const token = genToken("0109034748","admin");
            let res = await request(server)
            .post("/api/slots/addSlot")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "day":"mon",
                "slot_time":"60:00",
                "available":false
                })
            .expect(400);
        });
        it("Should respond 400 if one of inputs is missing or incorrect",async()=>{
            let res = await request(server)
            .post("/api/slots/addSlot")
            .expect(401);
        });
        it("Should respond 200 addedd Successfully",async()=>{
            const token = genToken("0109034748","admin");
            let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "phone_number":"01090113795",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category_id":1,
                "picture":"fkfjkfj",
                "price": "100",
            })
            .expect(201);
            const docId = res.body.data.doctor_id;
            res = await request(server)
            .post("/api/slots/addSlot")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "doctor_id":docId,
                "day":"mon",
                "start_time":"23:00",
                "end_time":"24:00",
                "slot_time":"60:00",
                "available":false
                })
            .expect(201);
            deleteDoctor("01090113795");
        });
    })
});