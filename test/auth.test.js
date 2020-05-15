const request = require("supertest");
const {deleteUser,blockUser} = require("../models/users");

let server;

describe("/api/auth",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })

    describe("/signup",async ()=>{
        it(
        "should respond with 400 if one of inputs is incorrect or missing (SCHEMA VALIDATION)",
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
            deleteUser("01590243399");
        });
    });




    describe("/signin",async()=>{
        it("should respond with 400 if input are missing (SCHEMA VALIDATION)",async()=>{
            let res = await request(server)
            .post("/api/auth/signin")
            .expect(400);
        });
        it("should respond with 401 when phone number notfound `backend side`",async()=>{
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
            deleteUser("01590243311");

        });
    });





    describe("/updateFirebaseToken",async()=>{
        it("Should respond with 400 if one of inpus is missed (SCHEMA VALIDATION)",async()=>{
            let res = await request(server)
            .patch("/api/auth/updateFirebaseToken")
            .send({"new_token":"haka"})
            .expect(400);
        });
        it("should respond with 401 if phone number not found `backend side`",async()=>{
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
            deleteUser("01590243399");
        });
        it("should respond with 403 if user is blocked",async()=>{
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
            await blockUser("01590243399");
            res = await request(server)
            .patch("/api/auth/updateFirebaseToken")
            .send({"phone_number":"01590243399","new_token":"123456789elhamdullah"})
            .expect(403);
            deleteUser("01590243399");
        });
    });





    describe("/signDoctors",async()=>{
        it("should respond with 400 if any inputs are incorrect or missed (SCHEMA VALIDATION)",async()=>{
            let res = request(server)
            .post("/api/auth/signDoctors")
            .send({phone_number:"02903"})
            .expect(400);
        });
        it("should respond with 401 if phone number or password are incorrect `backend side`",async()=>{
            let res = request(server)
            .post("/api/auth/signDoctors")
            .send({phone_number:"01090243795",password:"01288"})
            .expect(401);
        })
    })




})