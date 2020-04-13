// quick functionality to bottom buttons

const goHome = document.querySelector(".goHome");
const deleteAll = document.querySelector(".deleteAll");

goHome.onclick = function()
{
    window.open("./index.html", "_self");
}

deleteAll.onclick = function()
{
    // wipe all elements from allTasks, then return home
    while(allTasks.length)
    {
        allTasks.pop();
    }
    window.open("index.html", "_self");
}


// list out the tasks, along with a garbage can icon next to them

for (let i = 0; i < allTasks.length; i++)
{
    let tasksDiv = document.querySelector("div.tasks");
    tasksDiv.style.textAlign = "right";
    tasksDiv.style.padding = "5px 125px 5px 75px";

    let taskLabel = document.createElement("label");
    taskLabel.for = "trash";
    taskLabel.textContent = allTasks[i].name;
    taskLabel.style.fontSize = "72px";
    taskLabel.style.position = "relative";
    taskLabel.style.bottom = "9px";
    taskLabel.style.right = "80px";

    let trashCan = document.createElement("img");
    trashCan.src = "./img/trashcan.png";

    tasksDiv.appendChild(taskLabel);
    tasksDiv.appendChild(trashCan);
}


// TODO: give the garbage cans some functionality
// would be doable if I had linked them to the objects they were representing;
//     then I could easily attach which garbage can was pressed with which task to remove