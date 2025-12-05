document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const addTaskBtn = document.getElementById("add-task");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const confirmBtn = document.querySelector(".confirm-btn");
  const cancelModalBtn = document.getElementById("cancelModal");
  const confirmTaskBtn = document.querySelector(".confirm-task-btn");
  const cancelTaskModalBtn = document.getElementById("cancelModalTask");
  const toggleBtn = document.getElementById("toggleCategoryBtn");
  const closeCategoryBtn = document.querySelector(".closeCatBtn");
  const editCategoryBtn = document.querySelector(".edit-category-btn");
  const checkBtn = document.querySelector(".check");
  const tabButtons = document.querySelectorAll(".tab");

  const taskList = document.getElementById("task-list");

  const categoriesEl = document.querySelector(".categories");
  const emptyCategory = document.querySelector(".empty-category-container");
  const inputCategory = document.querySelector(".todo-input");

  const emptyTask = document.querySelector(".empty-task-container");

  const TasksListContainer = document.querySelector(".tasksIsEmpty");

  const modalOverlay = document.getElementById("categoryModal");
  const validationWarning = document.getElementById("validation-warning");

  const modalTaskOverlay = document.getElementById("taskModal");
  const validationTaskWarning = document.getElementById(
    "validation-warning-task"
  );
  const inputTask = document.querySelector(".todo-input-task");

  const categoryWrapper = document.querySelector(".category-wrapper");
  let categoryTitleEl = document.querySelector(".category-title");
  const taskWrapper = document.querySelector(".task-wrapper");
  const sideAddCat = document.querySelector(".side-category-btn");

  // State
  let todo = {};
  let activeCategory = null;
  let activeTab = "tasks"; // "tasks" or "completed"

  // Local Storage
  const saveLocal = () => localStorage.setItem("todo", JSON.stringify(todo));
  const getLocal = () => {
    const data = JSON.parse(localStorage.getItem("todo"));
    if (data) todo = data;
  };

  // Generate unique task ID
  const generateGlobalId = () => {
    let maxId = 0;
    Object.values(todo).forEach((tasks) => {
      tasks.forEach((task) => {
        if (task.id > maxId) maxId = task.id;
      });
    });
    return maxId + 1;
  };

  // Render categories
  const renderCategories = () => {
    categoriesEl.innerHTML = "";

    const keys = Object.keys(todo);
    console.log(todo);

    if (keys.length === 0) {
      emptyCategory.classList.remove("d-none");
      taskWrapper.classList.add("d-none");
      activeCategory = null;
    } else {
      emptyCategory.classList.add("d-none");
      taskWrapper.classList.remove("d-none");
      if (!activeCategory) activeCategory = keys[0];
    }

    categoryTitleEl.textContent = activeCategory || "";

    keys.forEach((cat) => {
      const li = document.createElement("li");
      li.classList.add("category-item");
      li.innerHTML = `
        <span class="category">${cat}</span>
        <img class="delete-btn" src="/assets/trash.svg" alt="Delete">
      `;

      li.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        delete todo[cat];
        if (activeCategory === cat) {
          const remaining = Object.keys(todo);
          activeCategory = remaining.length ? remaining[0] : null;
        }
        saveLocal();
        renderCategories();
        renderTasks();
      });

      li.querySelector(".category").addEventListener("click", () => {
        activeCategory = cat;
        renderCategories();
        renderTasks();
      });

      if (cat === activeCategory) li.classList.add("active");
      categoriesEl.appendChild(li);
    });
  };

  // Render tasks
  const renderTasks = () => {
    taskList.innerHTML = "";
    if (!activeCategory || !todo[activeCategory]) {
      emptyTask.style.display = "block";
      return;
    }

    const tasks = todo[activeCategory];
    const filteredTasks =
      activeTab === "tasks"
        ? tasks.filter((t) => !t.completed)
        : tasks.filter((t) => t.completed);
    TasksListContainer.style.display =
      filteredTasks.length === 0 ? "flex" : "none";
    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.dataset.id = task.id;
      li.classList.add("task-item");

      li.innerHTML = `
        <div class="task-item-wrapper">
          <input type="checkbox" class="task-checkbox" ${
            task.completed ? "checked" : ""
          }>
          <span class="task ${task.completed ? "completed" : ""}">${
        task.task
      }</span>
        </div>
        <div class="d-flex">
          
           <img class="delete-btn" src="/assets/trash_black.svg" alt="Delete">
            <img class="edit-btn" data-state="Edit" src="/assets/editTask.svg" alt="" />
          
        </div>
      `;

      // Delete task
      li.querySelector(".delete-btn").addEventListener("click", () => {
        // 1. Add animation class first
        li.classList.add("removing");

        // 2. Wait for animation to finish
        setTimeout(() => {
          // 3. Remove task from array
          todo[activeCategory] = todo[activeCategory].filter(
            (t) => t.id !== task.id
          );

          saveLocal();
          renderTasks();
        }, 600); // match your animation duration
      });

      // Edit task
      const editBtn = li.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => {
        if (editBtn.dataset.state === "Edit") {
          editBtn.dataset.state = "save";
          console.log(editBtn.src);
          editBtn.src = "/assets/check.svg";
          const span = li.querySelector(".task");
          const input = document.createElement("input");
          input.type = "text";
          input.classList.add("editing-task-input");
          input.value = span.textContent;
          span.replaceWith(input);
        } else {
          // editBtn.textContent = "Edit";
          editBtn.dataset.state = "Edit";
          editBtn.scr = "/assets/editTask.svg";
          const input = li.querySelector("input[type='text']");
          const span = document.createElement("span");
          span.classList.add("task");
          span.textContent = input.value;
          input.replaceWith(span);
          const existing = todo[activeCategory].find((t) => t.id === task.id);
          if (existing) existing.task = span.textContent;
          saveLocal();
          renderTasks();
        }
      });

      // Checkbox toggle
      li.querySelector(".task-checkbox").addEventListener("change", (e) => {
        task.completed = e.target.checked;
        saveLocal();
        renderTasks();
      });

      taskList.appendChild(li);
    });
  };

  // Modals
  addTaskBtn.addEventListener("click", () =>
    modalTaskOverlay.classList.remove("d-none")
  );
  sideAddCat.addEventListener("click", () =>
    modalOverlay.classList.remove("d-none")
  );
  addCategoryBtn.addEventListener("click", () => {
    inputCategory.value = "";
    validationWarning.classList.add("d-none");
    modalOverlay.classList.remove("d-none");
  });

  cancelModalBtn.addEventListener("click", () =>
    modalOverlay.classList.add("d-none")
  );
  cancelTaskModalBtn.addEventListener("click", () =>
    modalTaskOverlay.classList.add("d-none")
  );

  inputCategory.addEventListener("input", () => {
    if (inputCategory.value.trim()) validationWarning.classList.add("d-none");
  });
  inputTask.addEventListener("input", () => {
    if (inputTask.value.trim()) validationTaskWarning.classList.add("d-none");
  });

  // Add category
  confirmBtn.addEventListener("click", () => {
    const value = inputCategory.value.trim();
    if (!value) {
      validationWarning.classList.remove("d-none");
      validationWarning.textContent = "Category name is required";
      return;
    }
    if (!todo[value]) todo[value] = [];
    activeCategory = value;
    saveLocal();
    renderCategories();
    renderTasks();
    inputCategory.value = "";
    modalOverlay.classList.add("d-none");
  });

  // Add task
  confirmTaskBtn.addEventListener("click", () => {
    const value = inputTask.value.trim();
    if (!value) {
      validationTaskWarning.classList.remove("d-none");
      validationTaskWarning.textContent = "Task name is required";
      return;
    }
    if (!activeCategory) return;
    todo[activeCategory].push({
      id: generateGlobalId(),
      task: value,
      completed: false,
    });
    saveLocal();
    renderTasks();
    modalTaskOverlay.classList.add("d-none");
    inputTask.value = "";
  });

  // Toggle category sidebar
  toggleBtn.addEventListener("click", () =>
    categoryWrapper.classList.toggle("active")
  );
  closeCategoryBtn.addEventListener("click", () =>
    categoryWrapper.classList.remove("active")
  );

  // Tabs
  tabButtons.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabButtons.forEach((t) => t.classList.remove("active"));
      tabButtons.forEach((t) =>
        t.querySelector(".dot").classList.remove("active")
      );
      tab.classList.add("active");
      tab.querySelector(".dot").classList.add("active");
      activeTab = index === 0 ? "tasks" : "completed";
      renderTasks();
    });
  });

  // Edit category
  editCategoryBtn.addEventListener("click", () => {
    if (!activeCategory) return;
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("edit-input");
    input.value = activeCategory;

    categoryTitleEl.replaceWith(input);
    categoryTitleEl = input;
    checkBtn.classList.remove("d-none");
    editCategoryBtn.classList.add("d-none");
    input.focus();
  });

  checkBtn.addEventListener("click", () => {
    const input = categoryTitleEl;
    const newName = input.value.trim();
    if (!newName || newName === activeCategory) {
      const h1 = document.createElement("h1");
      h1.classList.add("category-title");
      h1.textContent = activeCategory;
      input.replaceWith(h1);
      categoryTitleEl = h1;
      checkBtn.classList.add("d-none");
      editCategoryBtn.classList.remove("d-none");
      return;
    }

    todo[newName] = todo[activeCategory];
    delete todo[activeCategory];
    activeCategory = newName;

    const h1 = document.createElement("h1");
    h1.classList.add("category-title");
    h1.textContent = activeCategory;
    input.replaceWith(h1);
    categoryTitleEl = h1;

    checkBtn.classList.add("d-none");
    editCategoryBtn.classList.remove("d-none");
    saveLocal();
    renderCategories();
    renderTasks();
  });

  // Init
  getLocal();
  renderCategories();
  renderTasks();
});
