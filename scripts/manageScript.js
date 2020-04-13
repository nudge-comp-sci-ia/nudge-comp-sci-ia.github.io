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


// list out the tasks, along with their corresponding plant next to them

for (let i = 0; i < allTasks.length; i++)
{
    let tasksDiv = document.querySelector("div.tasks");
    tasksDiv.style.textAlign = "right";
    tasksDiv.style.padding = "5px 125px 5px 75px";

    let taskLabel = document.createElement("p");
    taskLabel.textContent = allTasks[i].name;
    taskLabel.style.fontSize = "72px";
    taskLabel.style.display = "inline";
    taskLabel.style.position = "relative";
    taskLabel.style.bottom = "9px";
    taskLabel.style.right = "60px";
    taskLabel.style.fontFamily = "franklin gothic";

    let plant = document.createElement("img");
    chooseImage(allTasks[i], plant);

    let separator = document.createElement("p");

    tasksDiv.appendChild(taskLabel);
    tasksDiv.appendChild(plant);
    tasksDiv.appendChild(separator);
}
