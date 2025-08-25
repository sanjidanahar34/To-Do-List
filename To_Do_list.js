let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new_task").addEventListener("click", (e) => {
        e.preventDefault();
        addTask();
    });

    updateTask();
});

function addTask() {
    let taskInput = document.getElementById("add_task");
    let text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        updateTask();
    }
}

function updateTask() {
    const taskList = document.querySelector(".task_list");
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = "taskItem";

        const leftDiv = document.createElement("div");
        leftDiv.className = "left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            updateTask();
        });

        const taskText = document.createElement("p");
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.style.textDecoration = "line-through";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.className = "deleteBtn";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            updateTask();
        });

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(taskText);

        listItem.appendChild(leftDiv);
        listItem.appendChild(deleteBtn);

        taskList.appendChild(listItem);
    });

    updateProgress();
    checkAllCompleted();
}

function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    const progressBar = document.getElementById("progress");
    const numberDisplay = document.getElementById("numbers");

    const percent = total === 0 ? 0 : (completed / total) * 100;

    progressBar.style.width = `${percent}%`;
    numberDisplay.textContent = `${completed}/${total}`;
}

function checkAllCompleted() {
    const message = document.getElementById("complete_message");

    if (tasks.length > 0 && tasks.every(task => task.completed)) {
        message.style.display = "block";
        message.classList.add("celebrate");
    } else {
        message.style.display = "none";
        message.classList.remove("celebrate");
    }
}
