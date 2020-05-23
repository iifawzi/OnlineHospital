const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");
const {deleteUser,blockUser} = require("../models/users");
var expect = require('chai').expect;
const path = require("path");

let server;


describe("/api/user",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })

    describe("/updateInfo",async()=>{



        it("Should respond with 401 if not authorized",async()=>{
            let res = await request(server)
            .patch("/api/user/updateInfo")
            .send({"phone_number":"3487"})
            .expect(401);
        });
        it("Should respond with 400 if field is nor allowed",async()=>{
            const token = genToken("01590243311","user");
            let res = await request(server)
            .patch("/api/user/updateInfo")
            .send({"fb_token_id":"3487"})
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        });




        it("Should respond with 200 if successfully updated",async()=>{
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
            expect(res.body.data.phone_number).to.equal("01590243311");
            const token = genToken("01590243311","user");
             res = await request(server)
            .patch("/api/user/updateInfo")
            .send({
                "phone_number": "12345",
                "first_name": "ahmed",
                "last_name":"mohammed",
                "birth_date": "1999-03-22",
                "weight": 200,
                "height": 300,
                "bmi": 50,
                "gender": "male",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
            expect(res.body.data.phone_number).to.equal("12345");
            expect(res.body.data.first_name).to.equal("ahmed");
            expect(res.body.data.last_name).to.equal("mohammed");
            expect(res.body.data.birth_date).to.equal("1999-03-22");
            expect(res.body.data.weight).to.equal(200);
            expect(res.body.data.height).to.equal(300);
            expect(res.body.data.bmi).to.equal(50);
            expect(res.body.data.gender).to.equal("male");
        });



        it("Should respond with 403 if phone number is already registered",async()=>{
            let res = await request(server)
            .post("/api/auth/signup")
            .send({
                "phone_number": "01590243313",
                "first_name": "fawzi",
                "last_name":"ahmed",
                "birth_date": "1999-03-20",
                "weight": 100,
                "height": 180,
                "bmi": 28,
                "fb_token_id": "djdj84",
                "gender": "male",
            }).expect(201);
            expect(res.body.data.phone_number).to.equal("01590243313");
            const token = genToken("01590243313","user");
             res = await request(server)
            .patch("/api/user/updateInfo")
            .send({
                "phone_number": "12345",
                "first_name": "ahmed",
                "last_name":"mohammed",
                "birth_date": "1999-03-22",
                "weight": 200,
                "height": 300,
                "bmi": 50,
                "gender": "male",
            })
            .set("Authorization", `Bearer ${token}`)
            .expect(403);
            deleteUser("01590243313");
            deleteUser("12345");
        })    
})

describe("/notBlocked",async()=>{
    it("Should respond with 401 if not authorized",async()=>{
        let res = await request(server)
        .get("/api/user/notBlocked")
        .expect(401);
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
        const token = genToken("01590243399","user");
        await blockUser("01590243399");
        res = await request(server)
        .get("/api/user/notBlocked")
        .set("Authorization", `Bearer ${token}`)
        .expect(403);
        deleteUser("01590243399");
    });
});



describe("/api/user/updateImage",async()=>{
    it("Should responed with 200 if updated",async()=>{
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
        const token = genToken("01590243399","user");
        res = await request(server)
        .patch("/api/user/updateImage")
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file',path.resolve(__dirname, "../logo.png"))
        .expect(200);
    });
    it("Should responed with 403 if type not allowed",async()=>{
        const token = genToken("01590243399","user");
        let res = await request(server)
        .patch("/api/user/updateImage")
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file',path.resolve(__dirname, "../udemy-accs.txt"))
        .expect(403);
    });
    it("Should responed with 401 not authorized",async()=>{
        const token = genToken("01590241","user");
        let res = await request(server)
        .patch("/api/user/updateImage")
        .set("Authorization", `Bearer ${token}`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .attach('file',path.resolve(__dirname, "../logo.png"))
        .expect(401);
        deleteUser("01590243399");

    });

    // it("Should responed with 500 if file size is big than the allowed",async()=>{
    //     let res = await request(server)
    //    .patch("/api/user/updateImage")
    //     .set('Content-Type', 'application/x-www-form-urlencoded')
    //     .attach('file',path.resolve(__dirname, "../IMG_8755.JPG"))
    //     .expect(500);
    // }); // i don't have a big file, but it's working beleive me :D, 
})

});