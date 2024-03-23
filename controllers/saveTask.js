app.post("/saveTask", async (req, res) => {
  try {
    // Save the details to the database
    console.log(req.body);
    const { description } = req.body; //req.body as we are fetching from the submitted form

    // Create a new subject document
    const newTask = new Task({
      description,
    });
    await newTask.save();
    console.log("Details saved successfully!");
    res.redirect("/");
  } catch (error) {
    console.error("Error saving details:", error);
    res.status(500).send("Internal Server Error");
  }
});
