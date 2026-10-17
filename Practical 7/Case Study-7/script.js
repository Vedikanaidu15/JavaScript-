// Add a new task

function addTask() {

    let input = document.getElementById("taskInput");

    let taskText = input.value.trim();


    // Check empty input

    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    // Get task list

    let taskList = document.getElementById("taskList");


    // Remove empty message

    let emptyMessage = document.querySelector(".empty-message");

    if (emptyMessage) {

        emptyMessage.remove();
    }


    // Create new list item

    let taskItem = document.createElement("li");

    taskItem.className = "task-item";


    // Create task text

    let text = document.createElement("span");

    text.className = "task-text";

    text.innerText = taskText;


    // Mark task completed when clicked

    text.onclick = function () {

        taskItem.classList.toggle("completed");

        updateTaskCount();

    };


    // Create action buttons container

    let actions = document.createElement("div");

    actions.className = "task-actions";


    // Edit button

    let editButton = document.createElement("button");

    editButton.className = "edit-btn";

    editButton.innerText = "Edit";


    editButton.onclick = function () {

        editTask(taskItem, text);

    };


    // Delete button

    let deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.innerText = "Delete";


    deleteButton.onclick = function () {

        deleteTask(taskItem);

    };


    // Add buttons

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    // Add text and buttons to task

    taskItem.appendChild(text);

    taskItem.appendChild(actions);


    // Add task to list

    taskList.appendChild(taskItem);


    // Clear input

    input.value = "";

    input.focus();


    // Update counter

    updateTaskCount();
}



// Edit task

function editTask(taskItem, text) {

    let newText = prompt(
        "Edit your task:",
        text.innerText
    );


    if (newText !== null) {

        newText = newText.trim();


        if (newText !== "") {

            text.innerText = newText;

        } else {

            alert("Task cannot be empty.");

        }
    }
}



// Delete task

function deleteTask(taskItem) {

    let confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (confirmDelete) {

        taskItem.remove();

        updateTaskCount();


        // Show empty message if no tasks remain

        let taskList = document.getElementById("taskList");

        if (taskList.children.length === 0) {

            let emptyMessage = document.createElement("li");

            emptyMessage.className = "empty-message";

            emptyMessage.innerText =
                "No tasks added yet. Add your first task above!";

            taskList.appendChild(emptyMessage);
        }
    }
}



// Update task counters

function updateTaskCount() {

    let tasks = document.querySelectorAll(".task-item");

    let completedTasks =
        document.querySelectorAll(".task-item.completed");


    document.getElementById("taskCount").innerText =
        tasks.length;


    document.getElementById("completedCount").innerText =
        completedTasks.length + " completed";
}



// Press Enter to add task

document.getElementById("taskInput").addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);