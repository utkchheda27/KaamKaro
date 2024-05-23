//IMPORT LIBRARIES,PACKAGES AND CODE FROM OTHER FILES
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Task = require("./models/taskSchema");
const User = require("./models/userSchema.js")
const fs = require("fs");
const axios = require("axios");
const passport = require("passport");
const express = require("express");
const authMiddleware=require("./controllers/auth.js");
const {initializingPassport,isAuthenticated}=require("./passportConfig.js")
const expressSession=require("express-session");
const app = express();

//DATABASE
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

//using passport just after connecting to mongo db
initializingPassport(passport);

//Defining path for setting up location of views directory
const path = require("path");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./views")));
app.use(express.static("client"));

//Session Middleware
// app.use(
//   session({
//     secret:"Vader",
//     saveUninitialized:false,
//     resave:false,
//     cookie:{
//       maxAge:60000*60
//     }
//   })
// )

// app.use(passport.initialize());
// app.use(passport.session());

// app.post('/api/auth',passport.authenticate('local'),(req,res)=>{
  
// })

// Parse URL-encoded bodies (for form data)
//needed when using a form and using req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport js middleware
app.use(expressSession({
  secret:"secret",
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());

//Logging all the route hits while using the application
//used fs library  and maintaining a log.txt file for the same
app.use((req, res, next) => {
  //can also add in req.ip too
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.method} ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});

//Routing

app.get("/register",(req,res)=>{
  res.render("register")
})

app.get("/login",(req, res) => {
  res.render("login");
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Pass the error to the next middleware
    }
    res.redirect("/login");
  });
});

app.post("/register",async(req,res)=>{
  console.log(req.body)
  const user = await User.findOne({ username: req.body.username });
  if(user){
    res.send("User already exists");
  }else{
    const newUser =  await new User({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password
    });
    await newUser.save();
  }
    res.redirect("/");
})

app.post("/login", 
  passport.authenticate("local",{
    failureRedirect:"/login",
    successRedirect:"/"
  }));

//Display all the tasks on home route
app.get("/",isAuthenticated, async (req, res, next) => {
  console.log("Home Route");
  const allTasks = await Task.find({});
  res.render("home", { allTasks });
  next();
});

//saving new Task to DB
app.post("/saveTask", (req, res) => {
  const description = req.body.data; //req.body as we are fetching from the submitted form
  console.log("New Task Added: ", description);
  // Create a new subject document
  const newTask = new Task({
    description,
  });

  newTask.save();
  res.redirect("/");
});

//Delete a Task by clicking on button
app.post("/deleteTask", async (req, res) => {
  console.log("Delete task");
  console.log(req.body);
  const { id } = req.body;

  // Use id from selected button to findByIdAndDelete
  await Task.findByIdAndDelete(id);

  //Redirecting to '/' page after await activity of deleting in DB is performed..
  res.redirect("/");
});

app.get(`/checkBtn/:id`, async (req, res) => {
  try {
    const taskId = req.params.id;
    console.log(taskId);
    const task = await Task.findById(taskId);
    if (task) {
      const checkButtonStatus = task["isChecked"];
      console.log("Check button status:", checkButtonStatus);
      res.json({ btnStatus: checkButtonStatus });
    } else {
      console.log("Task not found");
    }
  } catch (err) {
    res.render("error");
  }
});

app.post("/toggleCheck", async (req, res) => {
  console.log("Toggling Check Button");
  console.log(req.body);
  const { id, btnStatus } = req.body;

  await Task.findByIdAndUpdate(id, {
    isChecked: btnStatus,
  });
  //Redirecting to '/' page after await activity of deleting in DB is performed..
  res.redirect("/");
});

app.get("/getTodos", async (req, res) => {
  const allTasks = await Task.find({});
  res.json(allTasks);
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
