const request = require("supertest");
var expect = require('chai').expect;
const {deleteDoctor} = require("../models/doctors");
const {deleteAdmin} = require("../models/admins");


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
            expect(res.body.data.phone_number).to.equal("01090243795");
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
            expect(res.body.data.phone_number).to.equal("01090243795");
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
        });
    });







    describe('/addingAdmin',async()=>{
        it("Should respond with 400 if one of inpus is missed or incorrect (SCHEMA VALIDATION",async()=>{
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .send({name:"fawzi"})
            .expect(400);
        });
        it("Should respond with 201 if created successfully",async()=>{
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .send({username:"fawzi",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
            .expect(201);
            expect(res.body.data.username).to.equal("fawzi");
        });
        it("Should Respond with 403 if username is already Registered",async()=>{
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .send({username:"fawzi",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
            .expect(403);
            deleteAdmin('fawzi');
        })
    });
   








    describe("/signAdmin",async()=>{
        it("should respond with 400 if input are missing (SCHEMA VALIDATION)",async()=>{
            let res = await request(server)
            .post("/api/controlPanel/signAdmin")
            .expect(400);
        });
        it("should respond with 401 when username is not found `backend side`",async()=>{
           let res = await request(server)
           .post("/api/controlPanel/signAdmin")
            .send({username:"fawzi",password:"testest"})
            .expect(401);
        });
        it("should respond with 200 if admin loged in successfully",async()=>{
            let res = await request(server)
            .post("/api/controlPanel/addAdmin")
           .send({username:"fawzi",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
           .expect(201);
            expect(res.body.data.username).to.equal("fawzi");
            res = await request(server)
            .post("/api/controlPanel/signAdmin")
            .send({"username":"fawzi","password":"testtest"})
            .expect(200);
            expect(res.body.data.username).to.equal('fawzi');
            deleteAdmin("fawzi");

        });
    });

    describe("/checkAdminByToken",async()=>{
        it("Should responed with 400 if token is missed",async()=>{
            let res = request(server)
            .post("/api/controlPanel/checkAdminByToken")
            .send({})
            .expect(400);
        });
        it("Should respond with 401 if admin is not authorized",async()=>{
            let res = request(server)
            .post("/api/controlPanel/checkAdminByToken")
            .send({token:"hddhdhhd"})
            .expect(401);
        });
        it("Should respond with 200 if token is valid and referanced to admin",async()=>{
            let res = request(server)
            .post("/api/controlPanel/checkAdminByToken")
            .send({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlpZmF3emlfIiwidXNlclJvbGUiOiJhZG1pbiIsImlhdCI6MTU4OTg1OTk0MiwiZXhwIjozMTcxMzQzMDIzNDJ9.m6i_8aAIxupAq7G2WebXDtS3ihecvWoFSC-Cq6LI2Qc"})
            .expect(200);
        })
    })
})