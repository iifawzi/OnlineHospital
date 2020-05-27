const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");
const {deleteAppointment} = require("../models/appointments");
const {deleteUser} = require("../models/users");

var expect = require('chai').expect;

let server;

describe("/api/slots",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })



    describe("/addAppointment",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/appointments/addAppointment")
            .expect(401);
        });
        it("Should respond 400 if one of inputs is missing or incorrect",async()=>{
            const token = genToken("0109034748","admin");
            let res = await request(server)
            .post("/api/appointments/addAppointment")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "slot_id": 1,
                "user_id":44554,
                })
            .expect(400);
        });
        it("Should respond 200 addedd Successfully",async()=>{
            const token = genToken("0109034748","admin");
            let res = await request(server)
            .post("/api/auth/signup")
            .send({
                "phone_number": "01590243399",
                "first_name": "fawzi",
                "last_name":"ahmed",
                "birth_date": "1999-03-20",
                "weight": 100,
                "height": 180,
                "bmi": 28,
                "fb_token_id": "djdj84",
                "gender": "male",
            })
            .expect(201);
            const userId = res.body.data.user_id;
             res = await request(server)
            .post("/api/appointments/addAppointment")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "slot_id": 1,
                "user_id":userId,
                "date":"1999-03-20"
                })
            .expect(201);
            const appId = res.body.data.slot_id;
            deleteAppointment(appId);
            deleteUser("01590243399");
        });
    });
});