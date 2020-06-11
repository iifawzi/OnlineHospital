var moment = require('moment'); // require

// // const dbDate = "2020-06-01"

// // const date = moment().format("YYYY-MM-DD");
// // const time = moment().format(); 

// // const dbMomentDate = moment("2020-06-01","YYYY-MM-DD").format("YYYY-MM-DD");
// // const dbMomentTime = moment('18:00+00:00Z', "HH:mm").parseZone();
// // const dbMomentTimeFiveAfter = moment(dbMomentTime).add(6,"m");
// // const dbMomentTimeFiveBefore = moment(dbMomentTime).subtract(6,"m");

// // const date = moment().utc().add(3,"d").format("YYYY-MM-DD");
// // const day = moment(date).format("ddd").toLowerCase();
// // console.log(date);
// // console.log(day);
// // const test = moment("mon 01:00","ddd hh:mm").utc().format("ddd hh:mm");
// // console.log(test);
// // console.log(test.split(" "));
// // const compareDate = moment(dbMomentDate).isSame(date); // true
// // const compareTime = moment(time).isBetween(dbMomentTimeFiveBefore,dbMomentTimeFiveAfter); // true


// // console.log("Database Date ",dbMomentDate);
// // console.log("Database Time  " ,dbMomentTime);
// // console.log("5 min after  " ,dbMomentTimeFiveAfter);
// // console.log("5 min before  " ,dbMomentTimeFiveBefore);
// // console.log("---------")
// // console.log("server date ",date);
// // console.log("server time ",time);
// // console.log("--------");
// // console.log(compareDate);
// // console.log(compareTime);
// const t = [1,2,3];
// for (n of t){
//     console.log(n);
// }
// const test =  moment("Tue Jun 02 2020 23:00:00 GMT+4", "ddd MMM DD YYYY HH:mm:ss").format("YYYY-MM-DD  HH:mm:ss");
// let ddd = moment("2020-06-01T23:00Z").utc().parseZone().utcOffset(120).format("YYYY-MM-DD");
// console.log(ddd);
// // const test = moment("23:00", "HH:mm").parseZone().utcOffset(120).format("HH:mm")
// // console.log(test);

// const {genToken} = require("./utils/shared/genToken");

// const token = genToken("01090243795",1,"user"); 
// console.log(token);

// let serverTime = moment().format();
// // let appEndTime = moment("2020-06-07 18:50:00").format("YYYY-MM-DDTHH:mm:ss");
// const end_time = "2020-06-07 18:55:00";
// // const compareBeforeEnd = moment(serverTime).isBefore(appEndTime);
// let currentTime = moment().utc();
// let finish_time = moment(end_time).utc();
// let remainingTime = finish_time.diff(currentTime,true);  // in milliseconds
// console.log(remainingTime);

console.log(typeof(Number(moment().format("x"))))
// const err = new Error("hala wallah");
// console.log(err.message);
