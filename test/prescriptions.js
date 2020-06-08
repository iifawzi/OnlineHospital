const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");
let server;

describe("/api/prescriptions",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })


    describe("/addPrescription",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .post("/api/prescriptions/addPrescription")
            .set("Authorization", `Bearer ${token}`)
            .expect(401);
        });
        it("Should respond with 400 if inuputs is incorrect or missing", async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .post("/api/prescriptions/addPrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_id": "1591389838616", 
              }) 
            .expect(400);
        })
        it("Should respond 201 if created successfully",async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .post("/api/prescriptions/addPrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_id": "1591389838616", 
                "diagnose": "dkkjdkjdkjdjkd",
                "prescription": "kjdjkdjkdkjdkj"
              }) 
            .expect(201);
        });
    });



});