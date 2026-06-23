// ======================
// State Management
// ======================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ======================
// DOM Elements
// ======================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelector(".filters");

// ======================
// Save Tasks
// ======================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ======================
// Render Tasks
// ======================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<li>No tasks available</li>";
        return;
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <div class="task-buttons">

                <button class="toggle-btn"
                        data-id="${task.id}">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn"
                        data-id="${task.id}">
                    Edit
                </button>

                <button class="delete-btn"
                        data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

// ======================
// Add Task
// ======================

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

// Add button click

addBtn.addEventListener("click", addTask);

// Enter key support

taskInput.addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
        addTask();
    }

});

// ======================
// Event Delegation
// ======================

taskList.addEventListener("click", function(e) {

    const id = Number(e.target.dataset.id);

    // Delete

    if (e.target.classList.contains("delete-btn")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }

    // Complete / Undo

    if (e.target.classList.contains("toggle-btn")) {

        const task = tasks.find(task => task.id === id);

        if (task) {
            task.completed = !task.completed;

            saveTasks();
            renderTasks();
        }
    }

    // Edit

    if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        if (!task) return;

        const updatedText = prompt(
            "Edit Task:",
            task.text
        );

        if (
            updatedText !== null &&
            updatedText.trim() !== ""
        ) {

            task.text = updatedText.trim();

            saveTasks();
            renderTasks();
        }
    }

});

// ======================
// Filter Tasks
// ======================

filters.addEventListener("click", function(e) {

    const filter = e.target.dataset.filter;

    if (!filter) return;

    currentFilter = filter;

    renderTasks();

});

// ======================
// Initial Load
// ======================

renderTasks();