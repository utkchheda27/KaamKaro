const mongoose = require("mongoose");
const Subject = require("./taskSchema");
const { query } = require("./queries");

// Connection URL and database name
const url = "mongodb://localhost:27017"; // Update with your MongoDB server URL
const dbName = "ToDoList"; // Update with your database name
const collectionName = "tasks"; // Update with your collection name

// Connect to the MongoDB server using Mongoose with the new URL parser
mongoose
  .connect("mongodb://localhost:27017/ToDoList", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database succcessfully");
  })
  .catch((err) => {
    console.log(err);
  });

query();

// Close the Mongoose connection
// mongoose.connection.close();
