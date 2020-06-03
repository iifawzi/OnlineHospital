var moment = require('moment'); // require

// const dbDate = "2020-06-01"

// const date = moment().format("YYYY-MM-DD");
// const time = moment().format(); 

// const dbMomentDate = moment("2020-06-01","YYYY-MM-DD").format("YYYY-MM-DD");
// const dbMomentTime = moment('18:00', "HH:mm");
// const dbMomentTimeFiveAfter = moment(dbMomentTime).add(6,"m");
// const dbMomentTimeFiveBefore = moment(dbMomentTime).subtract(6,"m");

const date = moment().utc().add(3,"d").format("YYYY-MM-DD");
const day = moment(date).format("ddd").toLowerCase();
// console.log(date);
// console.log(day);
const test = moment("2020-06-01T23:00:00").format()
console.log(test);
// const compareDate = moment(dbMomentDate).isSame(date); // true
// const compareTime = moment(time).isBetween(dbMomentTimeFiveBefore,dbMomentTimeFiveAfter); // true


// console.log("Database Date ",dbMomentDate);
// console.log("Database Time  " ,dbMomentTime);
// console.log("5 min after  " ,dbMomentTimeFiveAfter);
// console.log("5 min before  " ,dbMomentTimeFiveBefore);
// console.log("---------")
// console.log("server date ",date);
// console.log("server time ",time);
// console.log("--------");
// console.log(compareDate);
// console.log(compareTime);