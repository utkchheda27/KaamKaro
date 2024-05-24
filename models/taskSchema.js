const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./userSchema.js");

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: 0,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
    
  },
});

//Creating a model by using a well defined schema
//'Task' is the name of the model...Capital letter and singular
const Task = new mongoose.model("Task", taskSchema);
//mongo will take the model 'Task' and will create a collection called 'tasks' for us
//The const Task is a model class..now I can make instances of that class
taskSchema.plugin(passportLocalMongoose);
module.exports = Task;
