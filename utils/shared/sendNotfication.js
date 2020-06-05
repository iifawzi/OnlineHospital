const axios = require("axios");
const key = "key=AAAA7O02IZ4:APA91bF-hFYXpoiHtOKIeG5kF8JfyZq20l7gzu0UfRhoU_WgvGFBL6gYOKdBXBLBSG9poXeEWk7_mrg3lLbrWhraFDsHz3oecSbq5x-hZwYWD8CoQEoybrnLqECSmbJsX5LbNDMVmbur";
const RequestConfig = {
  headers: {
    Authorization: key,
  },
};
exports.sendNotfication = (to,message) => {
  const SendNotfiTo = {
    to,
    data: {
      title: "eClinic",
      message,
    },
  };
  try {
    axios.post("https://fcm.googleapis.com/fcm/send",SendNotfiTo,RequestConfig)
      .then((res) => {
      })
      .catch((error) => {
      });
  } catch (err) {
    console.log(err);
  }
};
exports.callNotfication = (to,room_id,user_name) => {
  const SendNotfiTo = {
    to,
    data: {
      title: "Call",
      room_id,
      user_name
    },
  };
  try {
    axios.post("https://fcm.googleapis.com/fcm/send",SendNotfiTo,RequestConfig)
      .then((res) => {
      })
      .catch((error) => {
      });
  } catch (err) {
    console.log(err);
  }
};

