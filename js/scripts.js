const formToDo = document.querySelector("#form-todo"); 
const editItemsList = document.querySelector("#edit-form")
const addItemInput = document.querySelector("#add-item");
const resultList = document.querySelector("#result-list");
const buttonAdd = document.querySelector("#btn-add");
const buttonCancel = document.querySelector("#btn-cancel");
const editInput = document.querySelector("#edit-input");
const searchItem = document.querySelector("#search-items");
const eraseButton = document.querySelector("#btn-search");
const filterButton = document.querySelector("#filter-select");
const tools = document.querySelector("#tools");

const changeIcon = document.querySelector(".fa-solid fa-check-double");

let oldTitle;

const saveNewNote = (text, done = 0, save = 1) => {
    // template
    const list = document.createElement("div");
    list.classList.add("list");

// 
    const listRight = document.createElement("div");
    listRight.classList.add("list-right");
    list.appendChild(listRight);

    const btnCheck = document.createElement("button");
    btnCheck.classList.add("btn-check-list");
    btnCheck.innerHTML = `<i class="fa-regular fa-circle-check"></i>`
    listRight.appendChild(btnCheck);

    const titleList = document.createElement("p");
    titleList.innerHTML = text;
    listRight.appendChild(titleList);
// 

// 
    const listLeft = document.createElement("div");
    listLeft.classList.add("list-left");
    list.appendChild(listLeft);

    const btnEditList = document.createElement("button");
    btnEditList.classList.add("btn-edit-list");
    btnEditList.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`
    listLeft.appendChild(btnEditList);

    const btnRemoveList = document.createElement("button");
    btnRemoveList.classList.add("btn-remove-list");
    btnRemoveList.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    listLeft.appendChild(btnRemoveList);    
// 

// Action - Local Storage
if(done) {
    list.classList.add("done");
}

if(save) {
    saveListLocalStorage({text, done})
}

resultList.appendChild(list);

// Clean input
addItemInput.value = "";
// Return to input
addItemInput.focus();
}


// Hide form and list when you need to edit something
const toggleForms = () => {
    editItemsList.classList.toggle("hide");
    formToDo.classList.toggle("hide");   
    tools.classList.toggle("hide");
    resultList.classList.toggle("hide"); 
};

const updateTodo = (text) => {
    // array list
    const lists = document.querySelectorAll(".list");

    // filter array
    lists.forEach((list) => {
        let titleList = list.querySelector("p");

        if(titleList.innerHTML === oldTitle) {
            titleList.innerHTML = text;

            updateLocalStorage(oldTitle, text);
        }
    });
};


getSearchList = (search) => {
        // array list
        const lists = document.querySelectorAll(".list");

        // filter array
        lists.forEach((list) => {
            // all words are lawercase to search
            let titleList = list.querySelector("p").innerHTML.toLowerCase();
            
            const normalizedSearch = search.toLowerCase();

            // Comeback all list 
            list.style.display = "flex";

            // todos que não estão na busca após ser normalizadas
            if(!titleList.includes(normalizedSearch)) {
                list.style.display = "none";
            }

        });
}

const filterList = (filterValue) => {
    const lists = document.querySelectorAll(".list");

    switch(filterValue){
        case "all":
            lists.forEach((list) => (list.style.display = "flex"));
            break;
        
        case "done":
            lists.forEach((list) => 
                list.classList.contains("done")
                    ? (list.style.display = "flex")
                    : (list.style.display = "none")
            );
        break;

        case "todo":
            lists.forEach((list) => 
                !list.classList.contains("done")
                    ? (list.style.display = "flex")
                    : (list.style.display = "none")
            );
        break;

        default:
            break;
    }

};

// Local Storage 
const getSaveListLocalStorage = () => {
    const lists = JSON.parse(localStorage.getItem("lists")) || [];
    return lists;
}

const loadLists = () => {
    const lists = getSaveListLocalStorage();

    lists.forEach((list) => {
        saveNewNote(list.text, list.done, 0);
    })
}

const saveListLocalStorage = (list) => {
    // save all list in the LS
    const lists = getSaveListLocalStorage();

    // add a new item in the array
    lists.push(list);

    // save list 
    localStorage.setItem("lists", JSON.stringify(lists));
}


const removeListLocalStorage = (listText) => {
    const lists = getSaveListLocalStorage();
    // Persista apenas os todos ok
    const filteredItems = lists.filter((list) => list.text !== listText);
    localStorage.setItem("lists", JSON.stringify(filteredItems));
}

const updateTodoStatusLocalStorage = (listText) => {
    const lists = getSaveListLocalStorage();
    lists.map((list) => 
        list.text === listText ? (list.done = !list.done) : null
    );
    localStorage.setItem("lists", JSON.stringify(lists));
}

const updateLocalStorage = (listOldText, listNewText) => {
    const lists = getSaveListLocalStorage();

    lists.map((list) => 
        list.text === listOldText ? (list.text = listNewText) : null
    );

    localStorage.setItem("lists", JSON.stringify(lists));
}

// Event

formToDo.addEventListener("submit", (e) => {
    e.preventDefault();
    // salve value
    const addItem = addItemInput.value;
    // valid if we can get the information
    if(addItem){
        // save info
        saveNewNote(addItem);
    }

})

document.addEventListener("click", (e) => {
    let titleList; 
    const targetEl = e.target;
    // obter o elemento da lista que contém o botão clicado
    const parentEl = targetEl.closest(".list");

    if (parentEl && parentEl.querySelector("p")) {
        titleList = parentEl.querySelector("p").innerHTML;
    }

    if(targetEl.classList.contains("btn-check-list")) {
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(titleList)
    }

    if(targetEl.classList.contains("btn-remove-list")) {
        parentEl.remove();
        removeListLocalStorage(titleList);
    }

    if(targetEl.classList.contains("btn-edit-list")) {
        toggleForms();

        editInput.value = titleList
        oldTitle = titleList;
    }
})

// cancel - edition 
buttonCancel.addEventListener ("click", (e) => {
    e.preventDefault();

    toggleForms();
})

// When user edit form - Save editions 
editItemsList.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    // valid
    if(editInputValue) {
        updateTodo(editInputValue);
    };

    // volta ao normal
    toggleForms();
});

// Search item 

searchItem.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchList(search);
});


// End search
eraseButton.addEventListener("click", (e) => {
    e.preventDefault();

    searchItem.value = "";

    // voltar dados
    searchItem.dispatchEvent(new Event("keyup"));
});


filterButton.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    filterList(filterValue);

});


// Init
loadLists();