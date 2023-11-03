"use strict"

const BASE_URL = "https://api.jsonbin.io/v3/b/6545425f54105e766fcb091f";
const SECRET_KEY = "$2a$10$nntMfKjg/L4x/peRMReE0.eCGZ1E0hL/RD2V.fc0z7lrbc1ORz4f2";

let todoList = []; //declares a new array for Your todo list

//set connection with database and read records to todoList
$.ajax({
    // copy Your bin identifier here. It can be obtained in the dashboard
    url: BASE_URL,
    type: 'GET',
    headers: { //Required only if you are trying to access a private bin
        'X-Master-Key': SECRET_KEY
    },
    success: (data) => {
        // console.log(data);
        todoList = data.record;
    },
    error: (err) => {
        console.log(err.responseJSON);
    }
});

let updateJSONbin = function() {
    $.ajax({
        url: BASE_URL,
        type: 'PUT',
        headers: { //Required only if you are trying to access a private bin
            'X-Master-Key': SECRET_KEY
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

//updates the todo list
let updateTodoList = function() {
    let todoListDiv =
        document.getElementById("todoListView");

    //remove all elements
    while (todoListDiv.firstChild) {
        todoListDiv.removeChild(todoListDiv.firstChild);
    }

    //add all elements
    let filterInput = document.getElementById("inputSearch");
    for (let todo in todoList) {
        if (
            (filterInput.value === "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ) {
            let newElement = document.createElement("p");
            let newContent = document.createTextNode(todoList[todo].title + " " +
                todoList[todo].description);

            //add delete button
            let newDeleteButton = document.createElement("input");
            newDeleteButton.type = "button";
            newDeleteButton.value = "x";

            //deletes element
            newDeleteButton.addEventListener("click",
                function() {
                    deleteTodo(todo);
                });

            newElement.appendChild(newContent);
            todoListDiv.appendChild(newElement);
            newElement.appendChild(newDeleteButton);
        }
    }
}

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
    //get the elements in the form
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");

    //create new item
    let newTodo = {
        title: inputTitle.value,
        description: inputDescription.value,
        place: inputPlace.value,
        dueDate: new Date(inputDate.value)
    };

    //add item to the list
    todoList.push(newTodo);
    updateJSONbin();
}

//updateTodoList function is called every 1 sec
setInterval(updateTodoList, 1000);