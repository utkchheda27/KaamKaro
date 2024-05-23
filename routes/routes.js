const express = require("express");
const app = express();

const taskController = require("../controllers/taskController");

app.route("/").get(taskController.getWelcome);

app
  .route("/register")
  .get(taskController.getRegister)
  .post(taskController.postRegister);

app.route("/login").get(taskController.getLogin).post(taskController.postLogin);

app.route("/library/:userID").get(taskController.getLibrary);

app.route("/library/:userID/signout").post(libraryController.postSignout);

app.route("/library/:userID/issueBook").post(libraryController.postIssueBook);

app.route("/library/:userID/returnBook").post(libraryController.postReturnBook);

app
  .route("/library/:userID/newBook")
  .get(libraryController.getNewBook)
  .post(libraryController.postNewBook);

module.exports = app;