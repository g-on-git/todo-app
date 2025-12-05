document.addEventListener("DOMContentLoaded", () => {
  // dom elements
  // buttons
  const addTaskBtn = document.getElementById("add-task");

  // category
  const categoryList = document.querySelector(".categories");
  const categoryEmptyState = document.querySelector(
    ".empty-category-container"
  );

  // state
  let todo = {};
  let activeCategory = null;
  let completedTask = "task"; // or completed

  // local storage
  const savelocal = () => localStorage.setItem("todo", JSON.stringify(todo));
  const getlocal = () => {
    const data = JSON.parse(localStorage.getItem("todo"));
    if (data) todo = data;
  };

  // render categories

  const renderCategory = () => {
    const keys = Object.keys(todo);

    console.log(keys);
  };

  // render tasks

  //   savelocal();
  //   getlocal();
  renderCategory();
});
