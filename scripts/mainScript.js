// functionality to add task and manage tasks buttons

const addTask = document.querySelector("button.addTask");
const manageTasks = document.querySelector("button.manageTasks");
const changeName = document.querySelector("button.changeName");
const heading = document.querySelector("h1");

addTask.onclick = function()
{
    window.open("./addTask.html", "_self");
}

manageTasks.onclick = function()
{
    window.open("./manageTasks.html", "_self");
}


flushGarden(); // set up garden once on startup. will be refreshed upon task updates in Task.js


// customizable username that will affect homescreen heading

function setUserName()
{
    let myName = prompt("Please enter your name.");
    if (!myName || myName === null)
    {
        setUserName();
    }
    else
    {
        localStorage.setItem("_name", myName);
        heading.textContent = "Welcome, " + myName;
    }
}

if (!localStorage.getItem("_name") || localStorage.getItem("_name") === null)
{
    setUserName();
}
else
{
    let storedName = localStorage.getItem("_name");
    heading.textContent = "Welcome, " + storedName;
}

// add functionality to the button to change the username

changeName.style.position = "relative";
changeName.style.top = "180px";
changeName.onclick = function()
{
    setUserName();
}


// function to add plants to the garden. loop through allTasks and add the corresponding image to a random spot on the garden

function flushGarden()
{
    let garden = document.querySelector("div.garden");

    // need to remove all items from the div first. or else images get duplicated
    while (garden.firstChild)
    {
        garden.removeChild(garden.lastChild);
    }

    for(let i = 0; i < allTasks.length; i++)
    {
        let image = document.createElement("img");

        // choose the correct image

        chooseImage(allTasks[i], image);

        // plant the image in the garden at random coords
        
        image.style.position = "absolute";
        let x = Math.random();
        let y = Math.random();
        image.style.left = "calc(" + x * 100 + "% - (64px * " + x + "))"; // 64px is the size of the image
        image.style.top = "calc(" + y * 100 + "% - (64px * " + y + "))";
        garden.appendChild(image);
    }
}


// separated function to handle image choice to break up code segments a little more

function chooseImage(task, img)
{
    if(!task.interval)
    {
        // interval was undefined: is a OneTask. plant a tree

        if(task.completed)
        {
            // was completed. live tree
            img.src = "img/grownTree.png";
        }
        else if (!task.active)
        {
            // was neglected. dead tree
            img.src = "img/deadTree.png";
        }
        else
        {
            // not yet complete. growing tree
            img.src = "img/youngTree.png";
        }
    }
    else
    {
        // interval was defined: is a Habit. plant a flowerbed

        if (!task.active)
        {
            // was neglected. dead flowers
            img.src = "img/deadFlowers.png";
        }
        else if (task.fulfilled)
        {
            // in bloom
            img.src = "img/openFlowers.png";
        }
        else
        {
            // out of bloom
            img.src = "img/closedFlowers.png";
        }
    }
}