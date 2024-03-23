// Selectors

const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");
const standardTheme = document.querySelector(".standard-theme");
const lightTheme = document.querySelector(".light-theme");
const darkerTheme = document.querySelector(".darker-theme");

// Event Listeners

toDoBtn.addEventListener("click", addToDo); //on clicking on submit new task button
toDoList.addEventListener("click", deletecheck); //on clicking on the entire to do list div
document.addEventListener("DOMContentLoaded", getTodos); //on page being loaded
standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
darkerTheme.addEventListener("click", () => changeTheme("darker"));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

// Functions;
async function addToDo(event) {
  // Prevents form from submitting / Prevents form from relaoding;
  event.preventDefault();

  // toDo DIV;
  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo", `${savedTheme}-todo`);

  // Create LI
  const newToDo = document.createElement("li");
  if (toDoInput.value === "") {
    alert("You must write something!");
  } else {
    // newToDo.innerText = "hey";
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    // check btn;
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    // delete btn;
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append to list;
    toDoList.appendChild(toDoDiv);

    //adding new task to db by making front end axios post api call to server
    try {
      await axios.post("/saveTask", { data: newToDo.innerText });
      console.log("Task added successfully!");
    } catch {
      console.log("Error aa rha bc!!");
    }
    // CLearing the input;
    toDoInput.value = "";
  }
}

async function deletecheck(event) {
  // console.log(event.target);
  const item=event.target;
  const deleteButtonId = item.parentElement.id;
  console.log(deleteButtonId);
  // const tasks=await axios.get("/getTodos");
  // console.log(tasks)
  // delete
  if (item.classList[0] === "delete-btn") {
    // item.parentElement.remove();
    // animation
    item.parentElement.classList.add("fall");

    // Your data to be sent in the POST request
    const data = { id: deleteButtonId };
    try {
      await axios.post("/deleteTask", data);
      console.log("Task deleted successfully!");
    } catch {
      console.log("Error aa rha bc!!");
    }
    item.parentElement.addEventListener("transitionend", function () {
      item.parentElement.remove();
    });

  }

  // If Check button clicked then run code
  if (item.classList[0] === "check-btn") {
    const checkButtonId = item.parentElement.id;

    const response = await axios.get(`/checkBtn/${checkButtonId}`);
    if (response.data["btnStatus"] == false) {
      const data = {
        id: checkButtonId,
        btnStatus: true,
      };
      await axios.post("/toggleCheck", data);
    } else {
      const data = {
        id: checkButtonId,
        btnStatus: false,
      };
      await axios.post("/toggleCheck", data);
    }
    item.parentElement.classList.toggle("completed");
  }
}

//Gets executed on every load..just loading up data of tasks
async function getTodos() {
  //Check: if item/s are there;
  // let todos = [];
  // Clear existing todo list before fetching and rendering new todos
  toDoList.innerHTML = "";

  // Fetch todo items from the database
  const response = await axios.get("/getTodos");
  const todos = response.data;
  todos.forEach(function (todo) {
    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo", `${savedTheme}-todo`);
    toDoDiv.setAttribute("id", todo["_id"]);

    // Create LI
    const newToDo = document.createElement("li");

    newToDo.innerText = todo["description"];
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    // check btn;
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);

    //check for iSchecked field and add or remove class
    if (todo["isChecked"] == true) {
      toDoDiv.classList.add("completed");
    } else {
      toDoDiv.classList.remove("completed");
    }
    toDoDiv.appendChild(checked);

    // delete btn;
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append to list;
    toDoList.appendChild(toDoDiv);
  });
}

// Change theme function:
function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");

  document.body.className = color;
  // Change blinking cursor for darker theme:
  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  document.querySelector("input").className = `${color}-input`;
  // Change todo color without changing their status (completed or not):
  document.querySelectorAll(".todo").forEach((todo) => {
    Array.from(todo.classList).some((item) => item === "completed")
      ? (todo.className = `todo ${color}-todo completed`)
      : (todo.className = `todo ${color}-todo`);
  });
  // Change buttons color according to their type (todo, check or delete):
  document.querySelectorAll("button").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "check-btn") {
        button.className = `check-btn ${color}-button`;
      } else if (item === "delete-btn") {
        button.className = `delete-btn ${color}-button`;
      } else if (item === "todo-btn") {
        button.className = `todo-btn ${color}-button`;
      }
    });
  });
}
