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
        });
        it("should respond with 403 if user or phone_number is already registered",async()=>{
            let res = await request(server)
            .post("/api/auth/signup")
            .send({
                "phone_number": "01590243399",
                "username": "aa3adiiiia12",
                "password":"hala",
                "first_name": "fawzi",
                "last_name":"ahmed",
                "birth_date": "1999-03-20",
                "weight": 100,
                "height": 180,
                "bmi": 28,
                "fb_token_id": "djdj84",
                "gender": "male",
            })
            .expect(403);
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
                "phone_number": "01590243399",
                "username": "fawzi",
                "password":"test01090243",
                "first_name": "fawzi",
                "last_name":"ahmed",
                "birth_date": "1999-03-20",
                "weight": 100,
                "height": 180,
                "bmi": 28,
                "fb_token_id": "djdj84",
                "gender": "male",
            }).expect(201);
            res = await request(server)
            .post("/api/auth/signin")
            .send({"username":"fawzi","password":"test01090243"})
            .expect(200);
            deletedUser("fawzi");
        })
    })
})