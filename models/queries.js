const mongoose = require("mongoose");
const Task = require("./taskSchema");

function query() {
  const task = new Task({ description: "migrate from v2.3 to v2.4" });
  task.save();
}
module.exports = { query };

//Another way of insertion other than .sub()
// Subject.insertMany({name:'DSA'},{grade:9.5}).then(m=>console.log(m));

// // Insert the document into the collection
// Subject.create(sub, (err, result) => {
//   if (err) {
//     console.error('Error inserting document:', err);
//   } else {
//     console.log(`Document inserted with _id: ${result._id}`);
//   }
