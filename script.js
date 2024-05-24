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
app.use(express.static(path.join(__dirname, "./assets")));
app.use(express.static("client"));

// Parse URL-encoded bodies (for form data)
//needed when using a form and using req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport js middleware
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30*7*24*1000*60*60,
    },
  })
);
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

//don't mix up authenticating and saving a new user to db
//use passport logic only for authentication
app.post("/register", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.send("User already exists");
    }

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password,
    });
    await newUser.save();

    // After successful registration, log the user in
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
});

app.post("/login", 
  passport.authenticate("local",{
    failureRedirect:"/login",
    successRedirect:"/"
  }));

//Display all the tasks on home route
app.get("/",isAuthenticated, async (req, res, next) => {
  console.log("Home Route");
  const allTasks = await Task.find({});
  const current_user=req.user;
  res.render("home", { allTasks,current_user});
  next();
});

//saving new Task to DB
app.post("/saveTask",isAuthenticated, async(req, res) => {
  try{
     const description = req.body.data; //req.body as we are fetching from the submitted form);
     const userId = req.user._id;
     // Create a new subject document
     const newTask = new Task({
       description,
       User:userId
     });
     await newTask.save();
     console.log("Details saved successfully!");

     //adding task to user ka Tasks list
     const user = await User.findById(userId);
     user.tasks.push(newTask);
     await user.save();
     res.redirect("/");
  }catch(err){
     console.error("Error saving task:", err);
     res.status(500).send("Internal Server Error");
  }
});

app.post("/deleteTask", async (req, res) => {
  try {
    console.log("Delete task");
    const { id } = req.body;

    // Validate task ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid task ID");
    }

    // Use id from selected button to findByIdAndDelete the task
    await Task.findByIdAndDelete(id);

    // Deleting task from tasks list of user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.tasks = user.tasks.filter((task) => !task.equals(id));
    await user.save();

    // Redirecting to '/' page after await activity of deleting in DB is performed
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get(`/checkBtn/:id`, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (task) {
      const checkButtonStatus = task["isChecked"];
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
  const { id, btnStatus } = req.body;
  await Task.findByIdAndUpdate(id, {
    isChecked: btnStatus,
  });
  //Redirecting to '/' page after await activity of deleting in DB is performed..
  res.redirect("/");
});

app.get("/getTodos", async (req, res) => {
  const user = await User.findById(req.user._id);
  const allTasks = await Task.find({User:user});
  res.json(allTasks);
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
