const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");
const {deleteDoctor} = require("../models/doctors");
const {deleteSlot} = require("../models/slots");
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



    describe("/addSlot",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/slots/addSlot")
            .expect(401);
        });
        it("Should respond 400 if one of inputs is missing or incorrect",async()=>{
            const token = genToken("0109034748",1,"admin");
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
        it("Should respond 200 addedd Successfully",async()=>{
            const token = genToken("0109034748",1,"admin");
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
                "slot_time":"3300",
                "available":false
                })
            .expect(201);
            const slotId = res.body.data.slot_id;
            deleteDoctor("01090113795");
            // deleteSlot(slotId);
        });
    });


    describe("/updateSlot",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .patch("/api/slots/updateSlot")
            .expect(401);
        });
        it("Should respond 400 if one of inputs is incorrect",async()=>{
            const token = genToken("0109034748",1,"admin");
            let res = await request(server)
            .patch("/api/slots/updateSlot")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "ahmed":"mon",
                })
            .expect(400);
        });
        it("Should respond 200 updated Successfully",async()=>{
            const token = genToken("0109034748",1,"admin");
            let res = await request(server)
            .patch("/api/slots/updateSlot")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "slot_id":1,
                "day":"wed",
                "start_time":"21:00",
                "slot_time":"30:00",
                "available":true
                })
            .expect(200);
            expect(res.body.data.day).to.equal("wed");
            const slotId = res.body.data.slot_id;
            // deleteSlot(slotId);
        });
    });


    describe("/getOpenSlots",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/slots/getOpenSlots")
            .expect(401);
        });
        it("Should respond 400 if one of inputs is missing or incorrect",async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .post("/api/slots/getOpenSlots")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "doctor_id":44554,
                })
            .expect(400);
        });
        it("Should respond 200 got slots Successfully",async()=>{
            const token = genToken("0109034748",1,"user");
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
            .post("/api/slots/getOpenSlots")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "doctor_id": 11,
                "searchIn":30,
                })
            .expect(200);
            deleteUser("01590243399");
        });
    });



    describe("/getDoctorDays",async()=>{	
        it("Should respond 401 if not Authorized",async()=>{	
            let res = await request(server)	
            .post("/api/slots/addSlot")	
            .expect(401);	
        });	
        it("Should respond 200 if got days susccessfully",async()=>{	
            const token = genToken("0109034748",1,"admin");	
            let res = await request(server)	
            .post("/api/controlPanel/addDoctor")	
            .set("Authorization", `Bearer ${token}`)	
            .send({	
                "phone_number":"01090113785",	
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
                "slot_time":"60:00",	
                "available":false	
                })	
            .expect(201);	
            const slotId = res.body.data.slot_id;	
            const doctorToken = genToken("01090113795",1,"doctor");	
            res = await request(server)	
            .post("/api/slots/getDoctorDays")	
            .set("Authorization", `Bearer ${doctorToken}`)	
            .expect(200);	
            deleteDoctor("01090113785");	
            // deleteSlot(slotId);	


        });	
    });

});