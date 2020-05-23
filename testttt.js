const dataToUpdate = {};
const updateUsers = (object) => {
  for (let key in object) {
    dataToUpdate[key] = object[key];
  }
};

const object = {
  first_name: "fawzi",
  last_name: "halawallah",
};

updateUsers(object);
console.log(dataToUpdate);
// "phone_number": "01590243399",
// "first_name": "fawzi",
// "last_name": "ahmed",
// "birth_date": "1999-03-20",
// "weight": 100,
// "height": 180,
// "gender": "male",
