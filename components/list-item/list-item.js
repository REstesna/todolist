import { mark } from "../../js/main.js";

const template = document.createElement("template");

template.innerHTML = `

<link rel="stylesheet" href="components/list-item/list-item.css">
<li class="list_item">
                    <div class="list_item-value">
                        <!-- <input type="checkbox" id="todo_status" hidden> -->

                        <div class="checkbox_item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>

                        </div>

                        <slot name="todo_value"></slot>
                    </div>
                    <div class="list_item_options">
                        <svg id="edit-task" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <svg id="complate-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

                        <svg id="delete-task" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path
                                d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" />
                            <path d="M14.625 3.75H3.375" stroke-linecap="round" />
                            <path
                                d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" />
                            <path d="M10.5 9V12.75" stroke-linecap="round" />
                            <path d="M7.5 9V12.75" stroke-linecap="round" />
                        </svg>

                        


                    </div>

                </li>`;

class listItemElem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.forSearchObj = {};
  }

  deletTask() {
    let localtodosArr = JSON.parse(localStorage.getItem("todos"));

    let mainTodo = localtodosArr.findIndex((item) => {
      return item.todoVal === this.querySelector("h3").innerHTML;
    });

    localtodosArr.splice(mainTodo, 1);
    localStorage.setItem("todos", JSON.stringify(localtodosArr));
    if (!localtodosArr.length) {
      document.querySelector("#none_task").style.display = "flex";
      // console.log(document.querySelector('#none_task'));
      
    }
        document.querySelector('#cancel_delete').classList.remove('show_undo_delete_button');
        clearInterval(this.deleteIntervalTiem);

    this.remove();
  }

  connectedCallback() {

    // To just be border between tasks.
    document.querySelector(".list_container list-item:last-child").shadowRoot &&
      (document
        .querySelector(".list_container list-item:last-child")
        .shadowRoot.querySelector("li").style.border = "none");

    // delete task btn handler    
    this.shadowRoot
      .querySelector("#delete-task")
      .addEventListener("click", () => {
        this.style.display = "none";
        document.querySelector('#cancel_delete').classList.add('show_undo_delete_button');
        document.querySelector('#cancel_delete span').innerHTML = 5;

        this.deleteIntervalTiem = setInterval( () => {
        document.querySelector('#cancel_delete span').innerHTML = (document.querySelector('#cancel_delete span').innerHTML - 1)

        } , 1000)
        this.timeOutForDelete = setTimeout(() => {
          this.deletTask();
          console.log("task deleted");
        }, 5000);

        document.querySelector('#cancel_delete')
          .addEventListener('click' ,( ) => {
        document.querySelector('#cancel_delete').classList.remove('show_undo_delete_button');
        clearInterval(this.deleteIntervalTiem);

            this.style.display = 'block';
            clearTimeout(this.timeOutForDelete);

          })
      });


    // to check and complate task   
    this.shadowRoot
      .querySelector(".checkbox_item")
      .addEventListener("click", () => {
        this.shadowRoot
          .querySelector(".checkbox_item")
          .classList.toggle("checked_item");
        this.querySelector("h3").style.opacity =
          this.querySelector("h3").style.opacity == "0.5" ? "1" : "0.5";
        this.querySelector("h3").style.textDecoration =
          this.querySelector("h3").style.textDecoration == "line-through"
            ? ""
            : "line-through";

        let localtodosArr = JSON.parse(localStorage.getItem("todos"));
        let mainTodoIndex = localtodosArr.findIndex((item) => {
          return item.todoVal === this.querySelector("h3").innerHTML;
        });

        localtodosArr[mainTodoIndex].complate =
          !localtodosArr[mainTodoIndex].complate;
        localStorage.setItem("todos", JSON.stringify(localtodosArr));
      });

    // get local todos :)  
    let localtodosArr = JSON.parse(localStorage.getItem("todos"));
    let mainTodoIndex = localtodosArr.findIndex(
      (item) => item.todoVal === this.querySelector("h3").innerHTML
    );
    if (localtodosArr[mainTodoIndex].complate) {
      this.shadowRoot
        .querySelector(".checkbox_item")
        .classList.toggle("checked_item");
    }

    // That the complete task is created first and then displayed. If it is not, it will be displayed in a mess for a moment.
    this.style.opacity = "0";
    setTimeout(() => {
      this.style.opacity = "1";
    }, 100);

    // edit task
    this.shadowRoot
      .querySelector("#edit-task")
      .addEventListener("click", () => {
        this.editInput = document.createElement("input");

        this.editInput.addEventListener("blur", () => {
          this.complateEditTask();
        });

        this.editInput.addEventListener('keyup', event => {
          
          if (event.keyCode === 13) {
            this.complateEditTask()
          }

        } )

        this.editInput.value = this.querySelector("h3").innerHTML;

        this.querySelector("h3").style.display = "none";

        this.shadowRoot
          .querySelector(".list_item_options")
          .classList.add("editing");

        this.shadowRoot
          .querySelector(".list_item-value")
          .append(this.editInput);
        this.editInput.focus();
      });

    // complate task editing

    this.shadowRoot
      .querySelector("#complate-edit")
      .addEventListener("click", () => {
        this.complateEditTask();
      });

    // edit task by ENTER

    
      
    
  }

  complateEditTask() {

    let localtodosArr = JSON.parse(localStorage.getItem("todos"));
    let mainTodoIndex = localtodosArr.findIndex(
      (item) => item.todoVal === this.querySelector("h3").innerHTML.trim()
    );

    this.shadowRoot
      .querySelector(".list_item_options")
      .classList.remove("editing");

    if (this.editInput.value.trim()) {

      this.querySelector("h3").innerHTML = this.editInput.value.trim();
    }  else {
      this.querySelector("h3").innerHTML = this.querySelector('h3').innerHTML;
    }
    // this.editInput.remove();
    this.editInput.style.display = 'none';
    this.querySelector("h3").style.display = "block";

    localtodosArr[mainTodoIndex].todoVal = this.editInput.value.trim();

    localStorage.setItem("todos", JSON.stringify(localtodosArr));
  }
}

export { listItemElem };
