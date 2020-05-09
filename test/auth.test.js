const request = require("supertest");
const {deletedUser} = require("../models/users");

let server;

describe("/api/auth",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })

    describe("/signup",async ()=>{
        it(
        "should respond with 400 if one of inputs is incorrect or missing",
        async ()=>{
            let res = await request(server)
            .post("/api/auth/signup").expect(400);  
            res = await request(server)
            .post("/api/auth/signup")
            .send({password:"fawzi"})
            .expect(400);
        });
        it("should respond with 201 if user succefully registered",async()=>{
            let res = await request(server)
            .post("/api/auth/signup")
            .send({
                "phone_number": "01590243399",
                "username": "aa3adiiiia12",
                "password":"hala",
                "province":"egypt",
                "first_name": "fawzi",
                "last_name":"ahmed"
            })
            .expect(201);
            deletedUser("aa3adiiiia12");
        });
    });
    describe("/signin",async()=>{
        it("should respond with 400 if any inputs are missing",async()=>{
            let res = await request(server)
            .post("/api/auth/signin")
            .expect(400);
        });
        it("should respond with 401 username is incorrect",async()=>{
           let res = await request(server)
            .post("/api/auth/signin")
            .send({"username":"fawzi","password":"test"})
            .expect(401);
        });
        it("should respond with 200 if user loged in successfully",async()=>{
            let res = await request(server)
            .post("/api/auth/signup")
            .send({
                "phone_number": "01590243391",
                "username": "fawzi",
                "password":"test01090243",
                "province":"egypt",
                "first_name": "fawzi",
                "last_name":"ahmed"
            }).expect(201);
            res = await request(server)
            .post("/api/auth/signin")
            .send({"username":"fawzi","password":"test01090243"})
            .expect(200);
            deletedUser("fawzi");
        })
    })
})