exports.postTasks= function(req, res) => {
  const description = req.body.data; //req.body as we are fetching from the submitted form
  console.log("New Task Added: ", description);
  // Create a new subject document
  const newTask = new Task({
    description,
  });

  newTask.save();
  res.redirect("/");
}
