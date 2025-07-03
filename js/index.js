"use strict";

import { listItemElem } from "../components/list-item/list-item.js";
import { mark } from "./main.js";

const $ = document;

const changeThemeBtn = $.querySelector("#dark_light-toggle");
const addTaskBtn = $.querySelector(".add_task_button > button");
const cancelAddTask = $.querySelector("#cancel_add_task");
const addTaskToTodoBtn = $.querySelector("#add_task_to_todo");
const addTaskModalContainer = $.querySelector(".add_task_modal_sec");
const addTaskInput = $.querySelector("#task_modal_input");
const categoryElem = $.querySelector(".categroy");
const searchBarSpan = $.querySelector(".active_input_span");
const searchBarInput = $.querySelector("#search-input");
const optionsCategoryElem = $.querySelector(".options");
const categoryIsShowing = $.querySelector(".show_category_title");
const listContainer = $.querySelector(".list_container");
const searchStatusSpanElem = $.querySelector("#search_status");
const searchBoxElem = $.querySelector('.search_box')
let searchedItems = null;
let todos = [];
let isModalOpen = false;
let themeFlag = false;

// func for set to local storage

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// func for get Item from local storage

function getLocalStorage(key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
}

//  window eventListners

window.addEventListener("load", () => {
  // set when page loaded
  themeFlag = getLocalStorage("theme");
  changeThemeHandler();

  // load saved todos
  getLocalStorage("todos") && generateTodos(getLocalStorage("todos"));

  $.querySelector('.loader_container').style.display = 'none'
});

// window sets

window.customElements.define("list-item", listItemElem);

// dark light button

changeThemeBtn.addEventListener("click", () => {
  themeFlag = !themeFlag;
  
  changeThemeBtn.blur();
  setLocalStorage("theme", themeFlag);

  changeThemeHandler();
});

function changeThemeHandler() {
  if (themeFlag) {
    $.documentElement.style.setProperty("--white-color-F7F7F7", "#252525");
    $.documentElement.style.setProperty("--black-color-252525", "#F7F7F7");
  } else {
    $.documentElement.style.setProperty("--white-color-F7F7F7", "#F7F7F7");
    $.documentElement.style.setProperty("--black-color-252525", "#252525");
  }

  if (themeFlag) {
    $.querySelector('#dark_light-toggle svg:first-child').style.display = 'none'
    $.querySelector('#dark_light-toggle svg:last-child').style.display = 'block'
  } else {
    $.querySelector('#dark_light-toggle svg:first-child').style.display = 'block'
    $.querySelector('#dark_light-toggle svg:last-child').style.display = 'none'

  }
}

// func for modal handler

function modalHandler() {
  if (isModalOpen) {
    // addTaskModalContainer.classList.add("visible_add_task");
    // document.body.style.overflow = "hidden";
    // addTaskModalContainer.style.overflow = "hidden";
    closeModal()
  } else {
    // addTaskModalContainer.classList.remove("visible_add_task");
    // document.body.style.overflow = "";
    // addTaskModalContainer.style.overflow = "";
    openModal()
  }
}

// Event Listener for add task to todoList

addTaskBtn.addEventListener("click", () => {
  isModalOpen = true;
  modalHandler();
  setTimeout(() => {
    addTaskInput.focus();
  }, 30);
});

cancelAddTask.addEventListener("click", () => {
  isModalOpen = false;
  modalHandler();
});

// add task to todolist

addTaskToTodoBtn.addEventListener("click", () => {
  addTaskHandler()
});

// scroll to view (phone)

addTaskInput.addEventListener("focus", () => {
  setTimeout(() => {
    addTaskModalContainer.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 300);

  // document.body.style.overflow = 'hidden'
});

// func for generate todos to DOM

function generateTodos(todosArr) {
  if (todosArr.length) {
    $.querySelector('#none_task').style.display = 'none';
    let docFrag = $.createDocumentFragment();
  todosArr.forEach((item) => {
    let newItem = $.createElement("list-item");

    if (item.complate) {
      newItem.innerHTML = `<h3 slot="todo_value" style="opacity: 0.5; text-decoration: line-through">${item.todoVal}</h3>`;
    } else {
      newItem.innerHTML = `<h3 slot="todo_value">${item.todoVal}</h3>`;
    }

    docFrag.append(newItem);
  });

  addTodosToDom(docFrag);
  } else {
    $.querySelector('#none_task').style.display = 'flex';
  }
}

function addTodosToDom(docFrag) {
  console.log(docFrag);
  listContainer.innerHTML = "";
  listContainer.append(docFrag);
}

// show category options

categoryElem.addEventListener("click", () => {
  categoryElem.classList.toggle("cat_visible");
});

/// search input event listener

searchBarInput.addEventListener("focus", () => {
  searchBarSpan.classList.add("active_input_span-show");
  // searchBarInput.style.paddingLeft = '3rem'
  searchBoxElem.style.boxShadow = '0 0 9px -3px var(--purple-color-6C63FF)'
});
searchBarInput.addEventListener("blur", () => {
  searchBarSpan.classList.remove("active_input_span-show");
    searchStatusSpanElem.classList.remove("active_search_status");
    searchBarInput.value = '';
  searchBoxElem.style.boxShadow = ''


  // searchBarInput.style.paddingLeft = '5px'
});

// set category

optionsCategoryElem.addEventListener("click", (e) => {
  todos = getLocalStorage("todos");
  let filtredTodos = null;

  if (
    e.target.innerHTML.toLowerCase() === "All".toLocaleLowerCase() &&
    e.target.innerHTML.toLowerCase() !=
      categoryIsShowing.innerHTML.toLocaleLowerCase()
  ) {
    console.log("all");
    categoryIsShowing.innerHTML = "All";
    todos = getLocalStorage("todos");
    generateTodos(todos);
  } else if (
    e.target.innerHTML.toLowerCase() === "Complate".toLocaleLowerCase() &&
    e.target.innerHTML.toLowerCase() !=
      categoryIsShowing.innerHTML.toLocaleLowerCase()
  ) {
    console.log("complate");
    todos = getLocalStorage("todos");
    filtredTodos = todos.filter((item) => item.complate === true);
    console.log(filtredTodos);
    categoryIsShowing.innerHTML = "Complate";
    generateTodos(filtredTodos);
  } else if (
    e.target.innerHTML.toLowerCase() === "Incomplete".toLocaleLowerCase() &&
    e.target.innerHTML.toLowerCase() !=
      categoryIsShowing.innerHTML.toLocaleLowerCase()
  ) {
    console.log();

    console.log("incomplate");
    categoryIsShowing.innerHTML = "incomplate";

    filtredTodos = todos.filter((item) => {
      return item.complate === false;
    });
    generateTodos(filtredTodos);
  }
});

// close automatic category

document.addEventListener("click", (e) => {
  try {
    if (!e.target.className.includes("categ")) {
      categoryElem.classList.remove("cat_visible");
    }
  } catch (err) {
    console.log("clicked btn in not expeted target");
    categoryElem.classList.remove("cat_visible");
  }
});


// search Handler

searchBarInput.addEventListener("keyup", (event) => {

  console.log(event);



  if (!searchBarInput.value) {
    searchStatusSpanElem.classList.remove("active_search_status");

    return;
  }

  if (searchBarInput.value.length < 3 ) {

    searchStatusSpanElem.classList.add("active_search_status");
    searchStatusSpanElem.innerHTML = 'Enter at least 3 character.';
    searchStatusSpanElem.style.backgroundColor = 'var(--purple-color-darker)';


    console.log(searchBarInput.value.length);
    
    return;

  }

  todos = getLocalStorage("todos");
  let mainTodosArr = todos.filter((item) => {
    return item.todoVal.includes(searchBarInput.value);
  });



   

    // searchStatusSpanElem.classList.remove("active_search_status");


    if (mainTodosArr.length) {

      searchStatusSpanElem.classList.add("active_search_status");

      searchStatusSpanElem.innerHTML = "The searched todo is in your list.";
      searchStatusSpanElem.style.backgroundColor = '#00C853'
      // searchStatusSpanElem.style.color = '#252525'

    } else {

      searchStatusSpanElem.classList.add("active_search_status");

      searchStatusSpanElem.innerHTML = "The searched todo is not in your list.";

      searchStatusSpanElem.style.backgroundColor = '#F44336'
      // searchStatusSpanElem.style.color = '#252525'

    }
 

  console.log(mainTodosArr);
});

// open and close modal

function closeModal () {
  addTaskModalContainer.classList.add("visible_add_task");
    document.body.style.overflow = "hidden";
    addTaskModalContainer.style.overflow = "hidden";
}

function openModal () {
  addTaskModalContainer.classList.remove("visible_add_task");
    document.body.style.overflow = "";
    addTaskModalContainer.style.overflow = "";
}

// handel modal with keyboard 

document.body.addEventListener('keyup', (e) => {
  
  
  if (e.code === 'Escape') {
    console.log(e , isModalOpen);


    addTaskModalContainer.classList.remove("visible_add_task");
    document.body.style.overflow = "";
    addTaskModalContainer.style.overflow = "";
    
  };

  if (e.keyCode === 13){
    addTaskHandler()
  }
});

// add task func

function addTaskHandler() {
  if (addTaskInput.value.trim()) {
    let newTodo = {
      id: todos.length,
      todoVal: addTaskInput.value,
      complate: false,
    };

    isModalOpen = false;
    modalHandler();

    addTaskInput.value = "";
    // todos = getLocalStorage('todos').push(newTodo);
    todos = getLocalStorage("todos");
    todos.unshift(newTodo);
    // todos[0] = newTodo

    setLocalStorage("todos", todos);
    generateTodos(todos);
  }
}


// test 

