const mongoose=require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const Task = require("./taskSchema.js");

const userSchema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
module.exports=User;
