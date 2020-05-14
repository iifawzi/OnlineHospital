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
        it("should respond with 403 if phone_number is already registered",async()=>{
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
            .expect(403);
            deletedUser("01590243399");
        });
    });




    describe("/signin",async()=>{
        it("should respond with 400 if input are missing",async()=>{
            let res = await request(server)
            .post("/api/auth/signin")
            .expect(400);
        });
        it("should respond with 401 when phone number notfound",async()=>{
           let res = await request(server)
            .post("/api/auth/signin")
            .send({"phone_number":"01590243311"})
            .expect(401);
        });
        it("should respond with 200 if user loged in successfully",async()=>{
            let res = await request(server)
            .post("/api/auth/signup")
            .send({
                "phone_number": "01590243311",
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
            .send({"phone_number":"01590243311"})
            .expect(200);
            deletedUser("01590243311");

        });
    });





    describe("Firebase Functions",async()=>{
        it("Should respond with 400 if one of inpus is missed",async()=>{
            let res = await request(server)
            .patch("/api/auth/updateFirebaseToken")
            .send({"new_token":"haka"})
            .expect(400);
        });
        it("should respond with 401 if phone number not found",async()=>{
            let res = await request(server)
            .patch("/api/auth/updateFirebaseToken")
            .send({"phone_number":"01090243795","new_token":"djkdjkdjk"})
            .expect(401);
        });
        it("should respond with 200 if we updated the token_id successfully",async()=>{
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
                "fb_token_id": "test",
                "gender": "male",
            }).expect(201);
            res = await request(server)
            .patch("/api/auth/updateFirebaseToken")
            .send({"phone_number":"01590243399","new_token":"123456789elhamdullah"})
            .expect(200);
        });
        it("should respond with 200 if we can get the token_id",async()=>{
            let res = await request(server)
            .post("/api/auth/getFirebaseToken")
            .send({"phone_number":"01590243399"})
            .expect(200);
        });
        it("should respond with 400 if phone_number is missed",async()=>{
            let res = await request(server)
            .post("/api/auth/getFirebaseToken")
            .send({})
            .expect(400);
        });
        it("should respond with 401 if phone_number is not found",async()=>{
            let res = await request(server)
            .post("/api/auth/getFirebaseToken")
            .send({"phone_number":"01590243311"})
            .expect(401);
            deletedUser("01590243399");
        });
    });





})