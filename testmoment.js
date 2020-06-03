var moment = require('moment'); // require

// const dbDate = "2020-06-01"

// const date = moment().format("YYYY-MM-DD");
// const time = moment().format(); 

// const dbMomentDate = moment("2020-06-01","YYYY-MM-DD").format("YYYY-MM-DD");
// const dbMomentTime = moment('18:00+00:00Z', "HH:mm").parseZone();
// const dbMomentTimeFiveAfter = moment(dbMomentTime).add(6,"m");
// const dbMomentTimeFiveBefore = moment(dbMomentTime).subtract(6,"m");

// const date = moment().utc().add(3,"d").format("YYYY-MM-DD");
// const day = moment(date).format("ddd").toLowerCase();
// console.log(date);
// console.log(day);
// const test = moment("mon 01:00","ddd hh:mm").utc().format("ddd hh:mm");
// console.log(test);
// console.log(test.split(" "));
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

const test =  moment("2020-06-01T23:00Z").format("YYYY-MM-DD");
console.log(test);
// const test = moment("23:00", "HH:mm").parseZone().utcOffset(120).format("HH:mm")
// console.log(test);