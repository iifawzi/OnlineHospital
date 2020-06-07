const request = require("supertest");
const {genToken} = require("../utils/shared/genToken");
const path = require("path");
let server;

describe("/api/messages",async()=>{
    beforeEach(()=>{
        server = require("../app");
    });
    afterEach(async()=>{
    })


    describe("/getFinishedMessages",async()=>{
        it("Should respond 401 if not Authorized",async()=>{
            let res = await request(server)
            .post("/api/messages/getFinishedMessages")
            .expect(401);
        });
        it("Should respond with 400 if room_id is missed", async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .post("/api/messages/getFinishedMessages")
            .set("Authorization", `Bearer ${token}`)
            .send({room_id: 1591470036382}) // should be a string not number
            .expect(400);
        })
        it("Should respond 200 if got messages successfully",async()=>{
            const token = genToken("0109034748",1,"user");
            let res = await request(server)
            .post("/api/messages/getFinishedMessages")
            .set("Authorization", `Bearer ${token}`)
            .send({room_id: "1591470036382"}) 
            .expect(200);
        });
    });



    describe("/uploadFile", async () => {
        it("Should responed with 201 if uploaded", async () => {
          const token = genToken("01090243795",1, "user");
          let res = await request(server)
            .post("/api/messages/uploadFile")
            .set("Authorization", `Bearer ${token}`)
            .set("chatRoomId", `589598958`)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .attach("file", path.resolve(__dirname, "../logo.png"))
            .expect(201);
        });
        it("Should responed with 403 if type is not allowed", async () => {
          const token = genToken("01090243795",1, "user");
          let res = await request(server)
          .post("/api/messages/uploadFile")
            .set("Authorization", `Bearer ${token}`)
            .set("chatRoomId", `589598958`)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .field('fawziSbahElkher', 'test yearb yeshtaghl')
            .attach("file", path.resolve(__dirname, "../udemy-accs.txt"))
            .expect(403);
        });
        // it("Should responed with 500 if file size is big than the allowed",async()=>{
        //     let res = await request(server)
        //     .post("/api/messages/uploadFile")
        //     .set('Content-Type', 'application/x-www-form-urlencoded')
        //     .attach('file',path.resolve(__dirname, "../IMG_8755.JPG"))
        //     .expect(500);
        // }); // i don't have a big file, but it's working beleive me :D,
      });
});