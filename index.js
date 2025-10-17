document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task");
  // const inputTask = document.getElementById("input-task");
  const taskList = document.getElementById("task-list");

  const addCategoryBtn = document.getElementById("add-category-btn");
  const inputCategory = document.querySelector(".todo-input");
  const categorries = document.querySelector(".categories");

  const emptyCategory = document.querySelector(".empty-category-container");
  const emptyTask = document.querySelector(".empty-task-container");

  const modalOverlay = document.getElementById("categoryModal");
  const cancelModalBtn = document.getElementById("cancelModal");
  const confimBtn = document.querySelector(".confirm-btn");
  const validationWarning = document.getElementById("validation-warning");

  const modalTaskOverlay = document.getElementById("taskModal");
  const cancelTaskModalBtn = document.getElementById("cancelModalTask");
  const confimTaskBtn = document.querySelector(".confirm-task-btn");
  const validationTaskWarning = document.getElementById(
    "validation-warning-task"
  );
  const inputTask = document.querySelector(".todo-input-task");

  const toggleBtn = document.getElementById("toggleCategoryBtn");
  const closeCategoryBtn = document.querySelector(".closeCatBtn");
  const categoryWrapper = document.querySelector(".category-wrapper");
  const categoryTitle = document.querySelector(".category-title");
  const taskWrapper = document.querySelector(".task-wrapper");

  const sideAddCat = document.querySelector(".side-category-btn");

  const tabButtons = document.querySelectorAll(".tab");
  // data-

  let todo = {};
  let activeTab = "tasks";

  activeCategory = Object.keys(todo || {})[0] ?? null;

  const saveLocal = () => {
    localStorage.setItem("todo", JSON.stringify(todo));
  };

  const getCategory = () => {
    const getlocal = JSON.parse(localStorage.getItem("todo"));

    if (!getlocal) {
      return;
    }
    todo = getlocal;
  };

  const renderCategory = () => {
    categorries.innerHTML = "";
    renderTasks();

    const categoryKeys = Object.keys(todo);

    if (categoryKeys.length > 0) {
      emptyCategory.classList.add("d-none");
      taskWrapper.classList.remove("d-none");
    }

    if (!activeCategory && categoryKeys.length > 0) {
      activeCategory = categoryKeys[0]; // ✅ Default to first category
    }
    console.log(activeCategory);
    categoryTitle.textContent = activeCategory;

    for (let category in todo) {
      const li = document.createElement("li");
      li.classList.add("category-item");
      // li.innerHTML = `${category}`;
      li.innerHTML = `<span class="category">${category}</span> <button class="delete-btn">Delete</button><button class="edit-category-btn">Edit</button>`;
      li.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        delete todo[category];
        if (activeCategory === category) {
          const keys = Object.keys(todo);
          activeCategory = keys.length ? keys[0] : null;
        }

        saveLocal();
        renderCategory();
        renderTasks();
      });

      li.querySelector(".edit-category-btn").addEventListener("click", (e) => {
        const btn = e.target;
        console.log(btn.textContent);

        if (btn.textContent === "Edit") {
          btn.textContent = "Save";
          const newInput = document.createElement("input");
          const span = li.querySelector("span");
          newInput.type = "text";
          newInput.value = span.textContent;
          span.replaceWith(newInput);
        } else if (btn.textContent === "Save") {
          btn.textContent = "Edit";
          const input = li.querySelector("input");
          const span = document.createElement("span");
          const tasks = todo[category];
          delete todo[category];
          todo[input.value] = tasks;
          span.textContent = input.value;

          if (activeCategory === category) {
            activeCategory = input.value;
          }

          input.replaceWith(span);
          saveLocal();
          renderCategory();
        }
      });
      if (category === activeCategory) {
        li.classList.add("active");
        renderTasks();
      }

      li.querySelector(".category").addEventListener("click", (e) => {
        activeCategory = category;
        renderCategory();
        renderTasks();
      });
      // li.addEventListener("click", (e) => {
      //   activeCategory = category;
      //   renderCategory();
      //   renderTasks();
      // });

      categorries.appendChild(li);
    }
  };

  // const renderTasks = () => {
  //   taskList.innerHTML = "";
  //   if (!activeCategory || !todo[activeCategory]) {
  //     // No active category -> nothing to show
  //     return;
  //   }
  //   const categoryTask = todo[activeCategory];
  //   if (categoryTask.length === 0) {
  //     emptyTask.style.display = "block";
  //   } else {
  //     emptyTask.style.display = "none";
  //   }
  //   categoryTask.forEach((e, index) => {
  //     const li = document.createElement("li");
  //     li.dataset.id = e.id;
  //     li.classList.add("task-item");
  //     li.innerHTML = `<span class="task ${e.completed ? "completed" : ""}"  >${
  //       e.task
  //     }</span> <div><button class="delete-btn d-none">Delete</button><button class="edit-btn">Edit</button></div>`;
  //     li.dataset.id = e.id;
  //     li.querySelector(".delete-btn").addEventListener("click", (e) => {
  //       // li.remove();
  //       todo[activeCategory] = todo[activeCategory].filter(
  //         (task) => task.id !== parseInt(li.dataset.id)
  //       );

  //       saveLocal();
  //       renderTasks();
  //     });

  //     li.querySelector(".edit-btn").addEventListener("click", (e) => {
  //       const btn = e.target;
  //       if (btn.textContent === "Edit") {
  //         btn.textContent = "Save";
  //         const newInput = document.createElement("input");
  //         const span = li.querySelector("span");
  //         newInput.type = "text";
  //         newInput.value = span.textContent;
  //         span.replaceWith(newInput);
  //       } else if (btn.textContent === "Save") {
  //         btn.textContent = "Save";
  //         const input = li.querySelector("input");
  //         const span = document.createElement("span");
  //         span.textContent = input.value;
  //         li.replaceWith(span);
  //         todo[activeCategory].find(
  //           (task) => task.id === parseInt(li.dataset.id)
  //         ).task = input.value;
  //         saveLocal();
  //         renderTasks();
  //       }
  //     });
  //     li.querySelector(".task").addEventListener("click", (e) => {
  //       e.target.classList.toggle("completed");
  //       const taskId = parseInt(li.dataset.id); // assuming you stored task id in data-id
  //       const task = todo[activeCategory].find((t) => t.id === taskId);

  //       if (task) {
  //         task.completed = e.target.classList.contains("completed");
  //         saveLocal();
  //       }
  //     });

  //     taskList.appendChild(li);
  //   });
  // };

  // addTaskBtn.addEventListener("click", (e) => {
  //   const inputValue = inputTask.value.trim();
  //   if (!inputValue) {
  //     alert("Please enter a task");
  //     return;
  //   }

  //   const taskItem = document.createElement("li");
  //   taskItem.innerHTML = `<span class="task">${inputValue}</span> <button class="delete-btn">Delete</button><button class="edit-btn">Edit</button>`;
  //   taskList.appendChild(taskItem);

  //   taskItem.querySelector(".delete-btn").addEventListener("click", (e) => {
  //     taskItem.remove();
  //   });
  //   taskItem.querySelector(".task").addEventListener("click", (e) => {
  //     e.target.classList.toggle("completed");
  //   });

  //   taskItem.querySelector(".edit-btn").addEventListener("click", (e) => {
  //     const btn = e.target;

  //     if (btn.textContent === "Edit") {
  //       btn.textContent = "Save";
  //       const newInput = document.createElement("input");
  //       const span = taskItem.querySelector("span");
  //       newInput.type = "text";
  //       newInput.value = span.textContent;

  //       span.replaceWith(newInput);
  //     } else {
  //       btn.textContent = "Edit";
  //       const input = taskItem.querySelector("input");
  //       const span = document.createElement("span");
  //       span.textContent = input.value;
  //       input.replaceWith(span);
  //       span.classList.add("task");
  //       taskItem.querySelector(".task").addEventListener("click", (e) => {
  //         e.target.classList.toggle("completed");
  //       });
  //     }
  //   });
  //   inputTask.value = "";
  // });

  const renderTasks = () => {
    taskList.innerHTML = "";

    if (!activeCategory || !todo[activeCategory]) return;

    // Show or hide empty message
    const categoryTasks = todo[activeCategory];
    const filteredTasks =
      activeTab === "tasks"
        ? categoryTasks.filter((t) => !t.completed)
        : categoryTasks.filter((t) => t.completed);

    emptyTask.style.display = filteredTasks.length === 0 ? "block" : "none";

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
      <div>
        <button class="delete-btn ">Delete</button>
        <a class="edit-btn">Edit</a>
      </div>
    `;

      // 🗑️ Delete
      li.querySelector(".delete-btn").addEventListener("click", () => {
        todo[activeCategory] = todo[activeCategory].filter(
          (t) => t.id !== parseInt(li.dataset.id)
        );
        saveLocal();
        renderTasks();
      });

      // ✏️ Edit
      li.querySelector(".edit-btn").addEventListener("click", (e) => {
        const btn = e.target;
        if (btn.textContent === "Edit") {
          btn.textContent = "Save";
          const span = li.querySelector(".task");
          const input = document.createElement("input");
          input.classList.add("editing-task-input");
          input.type = "text";
          input.value = span.textContent;
          span.replaceWith(input);
        } else {
          btn.textContent = "Edit";
          const input = li.querySelector("input[type='text']");
          const span = document.createElement("span");
          span.classList.add("task");
          span.textContent = input.value;
          input.replaceWith(span);

          const existing = todo[activeCategory].find(
            (t) => t.id === parseInt(li.dataset.id)
          );
          if (existing) {
            existing.task = span.textContent;
            saveLocal();
            renderTasks();
          }
        }
      });

      // ✅ Checkbox toggle completion
      li.querySelector(".task-checkbox").addEventListener("change", (e) => {
        const checked = e.target.checked;
        const id = parseInt(li.dataset.id);
        const currentTask = todo[activeCategory].find((t) => t.id === id);

        if (currentTask) {
          currentTask.completed = checked;
          saveLocal();
        }

        // Re-render to move between tabs automatically
        renderTasks();
      });

      taskList.appendChild(li);
    });
  };

  addTaskBtn.addEventListener("click", (e) => {
    console.log("click");
    modalTaskOverlay.classList.remove("d-none");
  });

  confimTaskBtn.addEventListener("click", () => {
    const inputValue = inputTask.value.trim();
    if (!inputValue) {
      validationTaskWarning.classList.remove("d-none");
      validationTaskWarning.textContent = "Task name is required";
      return;
    }

    const newTask = {
      id: generateGlobalId(),
      task: inputValue,
      completed: false,
    };
    todo[activeCategory].push(newTask);
    saveLocal();
    renderTasks();
    modalTaskOverlay.classList.add("d-none");
    inputTask.value = "";
  });

  addCategoryBtn.addEventListener("click", (e) => {
    inputCategory.value = "";
    validationWarning.classList.add("d-none");
    modalOverlay.classList.remove("d-none");
  });

  sideAddCat.addEventListener("click", (e) => {
    modalOverlay.classList.remove("d-none");
  });

  // Hide validation when typing
  inputCategory.addEventListener("input", () => {
    if (inputCategory.value.trim() !== "") {
      validationWarning.classList.add("d-none");
    }
  });
  inputTask.addEventListener("input", () => {
    if (inputTask.value.trim() !== "") {
      validationTaskWarning.classList.add("d-none");
    }
  });

  confimBtn.addEventListener("click", () => {
    const inputValue = inputCategory.value.trim();
    if (!inputValue) {
      validationWarning.classList.remove("d-none");
      validationWarning.textContent = "Category name is required";
      return;
    }
    validationWarning.classList.add("d-none");
    todo[inputValue] = [];
    activeCategory = inputValue;
    todo[inputValue] = [];
    saveLocal();
    renderCategory();
    inputCategory.value = "";
    modalOverlay.classList.add("d-none");
  });

  cancelModalBtn.addEventListener("click", () => {
    modalOverlay.classList.add("d-none");
  });
  cancelTaskModalBtn.addEventListener("click", () => {
    modalTaskOverlay.classList.add("d-none");
  });

  toggleBtn.addEventListener("click", () => {
    categoryWrapper.classList.toggle("active");
  });
  closeCategoryBtn.addEventListener("click", () => {
    categoryWrapper.classList.remove("active");
  });

  tabButtons.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      // Remove 'active' class from all tabs
      tabButtons.forEach((t) => t.classList.remove("active"));
      tabButtons.forEach((t) =>
        t.querySelector(".dot").classList.remove("active")
      );

      // Set active state
      tab.classList.add("active");
      tab.querySelector(".dot").classList.add("active");

      // Set current tab type
      activeTab = index === 0 ? "tasks" : "completed";

      // Re-render tasks
      renderTasks();
    });
  });
  function generateGlobalId() {
    let maxId = 0;
    for (const cat in todo) {
      todo[cat].forEach((task) => {
        if (task.id > maxId) maxId = task.id;
      });
    }
    return maxId + 1;
  }

  getCategory();
  saveLocal();
  renderCategory();
});
