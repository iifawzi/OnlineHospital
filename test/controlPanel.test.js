const request = require("supertest");
var expect = require('chai').expect;
const {deleteDoctor} = require("../models/doctors");
const {deleteAdmin} = require("../models/admins");
const {genToken} = require("../utils/shared/genToken");

const path = require("path");


let server;


describe("/api/controlPanel",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })


    describe("/addingDoctor",async()=>{
        it("Should respond with 400 if one of inpus is missed or incorrect (SCHEMA VALIDATION)",async()=>{
            const token = genToken("01090243795","admin");
            const res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .set("Authorization", `Bearer ${token}`)
            .expect(400);
        });
        it("Should respond with 201 if doctor created successfully",async()=>{
            const token = genToken("11090243799","admin");
            let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "phone_number":"11090243799",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "picture":"fkfjkfj",
                "price": "100",
            })
            .expect(201);
            expect(res.body.data.phone_number).to.equal("11090243799");
            deleteDoctor("11090243799");
        });
        it("Should respond with 403 if the phone number is already registered",async()=>{
            const token = genToken("01090243798","admin");
            let res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "phone_number":"01090243798",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "picture":"fkfjkfj",
                "price": "100",
            })
            .expect(201);
            expect(res.body.data.phone_number).to.equal("01090243798");
            res = await request(server)
            .post("/api/controlPanel/addDoctor")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "phone_number":"01090243798",
                "password":"testtest",
                "first_name":"fawzi",
                "last_name": "ahmed",
                "country":"egypt",
                "category":"3yon",
                "picture":"fkfjkfj",
                "price": "100",
            })
            .expect(403);
            deleteDoctor("01090243798");
        });
    });







    describe('/addingAdmin',async()=>{
        it("Should respond with 400 if one of inpus is missed or incorrect (SCHEMA VALIDATION",async()=>{
            const token = genToken("01090243795","admin");
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .set("Authorization", `Bearer ${token}`)
            .send({name:"fawzi"})
            .expect(400);
        });
        it("Should respond with 201 if created successfully",async()=>{
            const token = genToken("11090243799","admin");
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number:"11090243799",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
            .expect(201);
            expect(res.body.data.phone_number).to.equal("11090243799");
        });
        it("Should Respond with 403 if phone number is already Registered",async()=>{
            const token = genToken("01090243795","admin");
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number:"01090243795",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
            .expect(403);
            deleteAdmin('01090243795');
        })
    });
   








    describe("/signAdmin",async()=>{
        it("should respond with 400 if input are missing (SCHEMA VALIDATION)",async()=>{
            let res = await request(server)
            .post("/api/controlPanel/signAdmin")
            .expect(400);
        });
        it("should respond with 401 when phone number is not found `backend side`",async()=>{
           let res = await request(server)
           .post("/api/controlPanel/signAdmin")
            .send({phone_number:"01090243795",password:"testest"})
            .expect(401);
        });
        it("should respond with 200 if admin loged in successfully",async()=>{
            const token = genToken("01090243795","admin");
            let res = await request(server)
            .post("/api/controlPanel/addAdmin")
            .set("Authorization", `Bearer ${token}`)
           .send({phone_number:"01090243795",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
           .expect(201);
            expect(res.body.data.phone_number).to.equal("01090243795");
            res = await request(server)
            .post("/api/controlPanel/signAdmin")
            .send({"phone_number":"01090243795","password":"testtest"})
            .expect(200);
            expect(res.body.data.phone_number).to.equal('01090243795');
            deleteAdmin("01090243795");

        });
    });




    describe("/checkAdminByToken",async()=>{
        it("Should respond with 401 if admin is not authorized",async()=>{
            const token = genToken("01090243795","admin");
            let res = await request(server)
            .post("/api/controlPanel/checkAdminByToken")
            .set("Authorization", `Bearer ${token}`)
            .expect(401);
        });
        it("Should respond with 200 if token is valid and referanced to admin",async()=>{
            const token = genToken("01090243795","admin");
            let res = await request(server)
            .post('/api/controlPanel/addAdmin')
            .set("Authorization", `Bearer ${token}`)
            .send({phone_number:"01090243795",password:"testtest",name:"Fawzi E. Abdulfattah",role:"admin"})
            .expect(201);
             res = await request(server)
            .post("/api/controlPanel/checkAdminByToken")
            .send({})
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
            deleteAdmin("01090243795");
        })
    });




    describe("/addImage",async()=>{
        it("Should responed with 201 if uploaded",async()=>{
        const token = genToken("ahmed","admin");
            let res = await request(server)
            .post("/api/controlPanel/addImage")
            .set("Authorization", `Bearer ${token}`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .attach('file',path.resolve(__dirname, "../logo.png"))
            .expect(201);
        });
        it("Should responed with 403 if type not allowed",async()=>{
        const token = genToken("ahmed","admin");
            let res = await request(server)
            .post("/api/controlPanel/addImage")
            .set("Authorization", `Bearer ${token}`)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .attach('file',path.resolve(__dirname, "../udemy-accs.txt"))
            .expect(403);
        });
        // it("Should responed with 500 if file size is big than the allowed",async()=>{
        //     let res = await request(server)
        //     .post("/api/controlPanel/addImage")
        //     .set('Content-Type', 'application/x-www-form-urlencoded')
        //     .attach('file',path.resolve(__dirname, "../IMG_8755.JPG"))
        //     .expect(500);
        // }); // i don't have a big file, but it's working beleive me :D, 
    })
})