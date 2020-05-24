const request = require("supertest");
const {deleteDoctor} = require("../models/doctors");
const {genToken} = require("../utils/shared/genToken");
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
        it("Should respond with 404 if doctor not found",async()=>{
            const token = genToken("fawzii","user");
            let res = await request(server)
            .post("/api/doctors/getDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number: "01090243797"})
            .expect(404);
        });
        it("Should respond with 200 if got doctor successfully",async()=>{
            const token = genToken("fawzii","admin");
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
            .send({category_id: 42})
            .expect(200);
        });
    })




    describe("/updateDoctor",async()=>{
        it("Should respond with 401 if not authorized",async()=>{
            let res = await request(server)
            .patch("/api/doctors/updateDoctor")
            .send({"phone_number":"3487"})
            .expect(401);
        });
        it("Should respond with 400 if field is nor allowed",async()=>{
            const token = genToken("01590243311","admin");
            let res = await request(server)
            .patch("/api/doctors/updateDoctor")
            .send({"fb_token_id":"3487"})
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        });

        it("Should respond with 200 if successfully updated",async()=>{
            const token = genToken("11090243799", "admin");
            let res = await request(server)
              .post("/api/controlPanel/addDoctor")
              .set("Authorization", `Bearer ${token}`)
              .send({
                phone_number: "11090243799",
                password: "testtest",
                first_name: "fawzi",
                last_name: "ahmed",
                country: "egypt",
                category_id: 1,
                picture: "fkfjkfj",
                price: "100",
              })
              .expect(201);
              const docId = res.body.data.doctor_id;
            res = await request(server)
             .patch("/api/doctors/updateDoctor")
            .send({
                doctor_id: docId,
                phone_number: "112345",
                password: "t123",
                first_name: "fawziiiii",
                last_name: "ahmedddddd",
                country: "saudiarabia",
                category_id: 5,
                picture: "fkfjkfj",
                price: "300",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
            expect(res.body.data.phone_number).to.equal("112345");
            expect(res.body.data.password).to.equal("t123");
            expect(res.body.data.first_name).to.equal("fawziiiii");
            expect(res.body.data.last_name).to.equal("ahmedddddd");
            expect(res.body.data.country).to.equal("saudiarabia");
            expect(res.body.data.category_id).to.equal(5);
            expect(res.body.data.picture).to.equal("fkfjkfj");
            expect(res.body.data.price).to.equal("300");
        });



        it("Should respond with 403 if new phone number is already registered",async()=>{
            const token = genToken("01590243313","admin");
          let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({
              phone_number: "110902411",
              password: "testtest",
              first_name: "fawzi",
              last_name: "ahmed",
              country: "egypt",
              category_id: 1,
              picture: "fkfjkfj",
              price: "100",
            })
            .expect(201);
            const docId = res.body.data.doctor_id;
            res = await request(server)
            .patch("/api/doctors/updateDoctor")
            .send({
                doctor_id: docId,
                phone_number: "112345",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(403);
            deleteDoctor("110902411");
            deleteDoctor("112345");
        })    
})
})