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


    describe("/updatePrescription",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .put("/api/prescriptions/updatePrescription")
            .set("Authorization", `Bearer ${token}`)
            .expect(401);
        });
        it("Should respond with 400 if inuputs is incorrect or missing", async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .put("/api/prescriptions/updatePrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_id": "1591389838616", 
              }) 
            .expect(400);
        })
        it("Should respond 201 if updated successfully",async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .put("/api/prescriptions/updatePrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_id": "1591389838616", 
                "diagnose": "kjdjkdjkkjdjkdkj",
                "prescription": "kjdjkdjkdkjdkj"
              }) 
            .expect(200);
        });
        it("Should respond 404 if not found",async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .put("/api/prescriptions/updatePrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_id": "15913898384984984616", 
                "diagnose": "dkkjdkjdkjdjkd",
                "prescription": "kjdjkdjkdkjdkj"
              }) 
            .expect(404);
        });
    });



    describe("/getPrescription",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/prescriptions/getPrescription")
            .expect(401);
        });
        it("Should respond with 400 if room_id is missing or incorrect", async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .post("/api/prescriptions/getPrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_i": "1591389838616", 
              }) 
            .expect(400);
        })
        it("Should respond with 200 if got prescription successfully",async()=>{
            const token = genToken("0109034748",1,"doctor");
            let res = await request(server)
            .post("/api/prescriptions/getPrescription")
            .set("Authorization", `Bearer ${token}`)
            .send({
                "room_id": "1591389838616", 
              }) 
            .expect(200);
        });
    });

});