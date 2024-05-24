const User = require("../models/userSchema.js");
app.post("/saveTask", async (req, res) => {
  try {
    // Save the details to the database
    console.log(req.body);
    const { description } = req.body; //req.body as we are fetching from the submitted form

    // Create a new subject document
    const newTask = new Task({
      description,
      User:req.user_id
    });
    console.log(newTask)
    await newTask.save();
    console.log("Details saved successfully!");

    //adding task to user ka Tasks list
    const user = await User.findById(req.user._id);
    user.tasks.push(newTask);
    await user.save();

    //redirecting to home page after creating task
    res.redirect("/");
  } catch (error) {
    console.error("Error saving details:", error);
    res.status(500).send("Internal Server Error");
  }
});
