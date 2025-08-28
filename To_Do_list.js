let tasks = [];

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks after page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    tasks.forEach(task => {
        if (task.notified === undefined) task.notified = false;
    });

    // Request Notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // Check reminders every second
    setInterval(checkReminders, 1000);

    document.getElementById("new_task").addEventListener("click", (e) => {
        e.preventDefault();
        addTask();
    });

    updateTask();
});

// Add new task
function addTask() {
    let taskInput = document.getElementById("add_task");
    let text = taskInput.value.trim();
    let timeInput = document.getElementById("task_time");
    let taskTime = timeInput.value;

    if (text) {
        tasks.push({
            id: Date.now(),
            text: text,
            completed: false,
            time: taskTime
        });
        taskInput.value = '';
        timeInput.value = '';
        updateTask();
        saveTasks();
    }
}

// Format time to 12-hour format
function formatTimeTo12Hour(time) {
    if (!time) return "";
    let [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

// Update task list
function updateTask() {
    const taskList = document.querySelector(".task_list");
    taskList.innerHTML = '';

    tasks.forEach(task => {
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
            saveTasks();
        });

        const taskText = document.createElement("p");
        const displayTime = formatTimeTo12Hour(task.time);

        taskText.innerHTML = task.completed
            ? `${task.text}  <span class="time"><i class="fas fa-clock"></i> ${displayTime} ✅</span>`
            : `${task.text}  <span class="time"><i class="fas fa-clock"></i> ${displayTime}</span>`;

        taskText.style.color = "var(--text)";

        if (task.completed) {
            listItem.style.backgroundColor = "#4c8ebcff";
        } else {
            listItem.style.backgroundColor = "var(--secondaryBackground)";
        }
        listItem.style.transition = "background-color 0.3s ease";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteBtn";
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.style.color = "white";
        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            updateTask();
            saveTasks();
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

// Check reminders
function checkReminders() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    tasks.forEach(task => {
        if (!task.completed && task.time && !task.notified) {
            const [taskHour, taskMinute] = task.time.split(":").map(Number);

            if (taskHour === currentHour && taskMinute === currentMinute) {
                let audio = new Audio("ting.wav");
                audio.play();

                if (Notification.permission === "granted") {
                    new Notification("To-Do Reminder", { body: task.text });
                }

                const messageDiv = document.createElement("div");
                messageDiv.className = "reminderMessage";
                messageDiv.textContent = `Reminder: ${task.text}`;
                document.body.appendChild(messageDiv);

                setTimeout(() => {
                    messageDiv.remove();
                }, 5000);

                task.notified = true;
                saveTasks();
            }
        }
    });
}

// Update progress bar
function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;

    const progressBar = document.getElementById("progress");
    const numberDisplay = document.getElementById("numbers");

    const percent = total === 0 ? 0 : (completed / total) * 100;

    progressBar.style.width = `${percent}%`;
    numberDisplay.textContent = `${completed}/${total}`;
}

// Check if all tasks completed
function checkAllCompleted() {
    const message = document.getElementById("complete_message");

    if (tasks.length > 0 && tasks.every(task => task.completed)) {
        message.style.display = "block";
        message.classList.remove("fade-out");
        showConfetti();
        setTimeout(() => {
            message.classList.add("fade-out");
        }, 3000);
    } else {
        message.style.display = "none";
        message.classList.remove("fade-out");
    }
}

// Confetti animation 🎉
function showConfetti() {
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
    });
}

