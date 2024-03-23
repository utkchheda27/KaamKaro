const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description:{
    type:String,
    required:true
  },
  isChecked:{
    type:Boolean,
    default:0
  }
});

//Creating a model by using a well defined schema
//'Task' is the name of the model...Capital letter and singular
const Task = new mongoose.model("Task", taskSchema);
//mongo will take the model 'Task' and will create a collection called 'tasks' for us
//The const Task is a model class..now I can make instances of that class

module.exports = Task;
