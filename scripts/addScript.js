// quick functionality to the two bottom buttons: confirm task and go home

const confirm = document.querySelector(".confirm");
const goHome = document.querySelector(".goHome");

confirm.addEventListener("click", confirmTask);

goHome.onclick = function()
{
    window.open("./index.html", "_self");
}


/*--- draw up the selection series based on which radio button is being pressed ---*/

updateDetails();

const radios = document.querySelector(".taskType");
radios.addEventListener("click", updateDetails);

function updateDetails()
{
    // function to show either the "finish by" selection series or the "remind every" selection series,
    //     depending on which radio button is selected (OneTime or Habit)
    // called whenever the radio div is clicked
    // first clears the details div, then adds in the correct entry fields

    // clear all elements from the details div by looping through and deleting children
    let parentDiv = document.querySelector(".detailDiv");
    while (parentDiv.firstChild)
    {
        parentDiv.removeChild(parentDiv.lastChild);
    }

    // add contents to the details div depending on the radio button currently selected

    if (document.getElementById("onetask").checked)
    {
        // OneTask: need completion time

        let finishMsg = document.createElement("label");
        finishMsg.textContent = "Finish by:";
        parentDiv.appendChild(finishMsg);
        parentDiv.appendChild(document.createElement("p"));

        // select month by a selection box
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let monthSelect = document.createElement("select");
        monthSelect.id = "month";
        parentDiv.appendChild(monthSelect);
        // add options
        for (let i = 0; i < months.length; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = months[i];
            monthSelect.appendChild(option);
        }

        // select date by selection box
        let daySelect = document.createElement("select");
        daySelect.id = "day";
        parentDiv.appendChild(daySelect);
        for (let i = 1; i <= 31; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            daySelect.appendChild(option);
        }

        // at message
        let at = document.createElement("p");
        at.textContent = "at";
        parentDiv.appendChild(at);

        // select hour by selection box
        let hourSelect = document.createElement("select");
        hourSelect.id = "hour";
        parentDiv.appendChild(hourSelect);
        for (let i = 0; i <= 23; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            hourSelect.appendChild(option);
        }

        // colon
        let colon = document.createElement("label");
        colon.textContent = ":";
        parentDiv.appendChild(colon);

        // select minute by selection box
        let minuteSelect = document.createElement("select");
        minuteSelect.id = "minute";
        parentDiv.appendChild(minuteSelect);
        for (let i = 0; i <= 59; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            minuteSelect.appendChild(option);
        }
    }

    else
    {
        // Habit: need interval

        let remindMsg = document.createElement("label");
        remindMsg.textContent = "Remind every:";
        parentDiv.appendChild(remindMsg);
        parentDiv.appendChild(document.createElement("p"));

        // select days by selection box
        let daySelect = document.createElement("select");
        daySelect.id = "iDay";
        parentDiv.appendChild(daySelect);
        for (let i = 0; i <= 30; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            daySelect.appendChild(option);
        }

        let daysMarker = document.createElement("label");
        daysMarker.textContent = " days, "
        parentDiv.appendChild(daysMarker);

        // select hour by selection box
        let hourSelect = document.createElement("select");
        hourSelect.id = "iHour";
        parentDiv.appendChild(hourSelect);
        for (let i = 0; i <= 23; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            hourSelect.appendChild(option);
        }

        let hoursMarker = document.createElement("label");
        hoursMarker.textContent = " hours, and "
        parentDiv.appendChild(hoursMarker);

        // select minute by selection box
        let minuteSelect = document.createElement("select");
        minuteSelect.id = "iMinute";
        parentDiv.appendChild(minuteSelect);
        for (let i = 0; i <= 59; i++)
        {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            minuteSelect.appendChild(option);
        }

        let minutesMarker = document.createElement("label");
        minutesMarker.textContent = " minutes."
        parentDiv.appendChild(minutesMarker);
    }
}


/*--- take the details from the selection series and make a new task ---*/

function confirmTask()
{
    // function to retrieve the details from the selection boxes above and 
    //     create the correct type of task (OneTask or Habit) depending on the radio button selected
    // the task created is added to the global list allTasks

    // collect the correct amount of info depending on the radio button selected
    // then go home

    if (document.getElementById("onetask").checked)
    {
        // OneTask: collect name, completion time

        let name = document.getElementById("taskName").value;
        if (!name) { name = "MyTask"; }

        let month = document.getElementById("month").value;
        let day = document.getElementById("day").value;
        let hour = document.getElementById("hour").value;
        let minute = document.getElementById("minute").value;

        let currentDate = new Date();
        let date = new Date(currentDate.getFullYear(), month, day, hour, minute, 0, 0);

        // correct the year if the deadline is in the past
        if (date < currentDate)
        {
            date.setFullYear(currentDate.getFullYear() + 1);
        }

        // make a new OneTask with the info and add it to allTasks in correct position
        // allTasks is sorted by reminder time. need to compare times and insert once the time we're looking at is too much
        // auto inserts the task if we find an inactive task, since by definition inactive tasks are at the end of the list
        // needed the first if statement in case allTasks is empty otherwise the comparison
        //     won't work and the task won't get added

        let task = new OneTask(name, date, true, false);
        if (!allTasks.length)
        {
            allTasks[0] = task;
        }
        else
        {
            let inserted = false;
            for (let i = 0; i < allTasks.length; i++)
            {
                if (allTasks[i].time > task.time || !allTasks[i].active)
                {
                    allTasks.splice(i, 0, task);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) { allTasks.push(task); }
        }
    }
    else
    {
        // Habit: collect name, time interval
        let name = document.getElementById("taskName").value;
        if (!name) { name = "MyHabit"; }

        // used iDay, etc. because day, etc. still points to the OneTask selection series.
        let day = Number(document.getElementById("iDay").value);
        let hour = Number(document.getElementById("iHour").value);
        let minute = Number(document.getElementById("iMinute").value);

        // get the total number of minutes as the interval
        let interval = day * 24 * 60 + hour * 60 + minute;
        if (!interval) { interval = 60; } // if the interval was left as 0, default to 1 hour

        // add the interval to the current time to get the first reminder time
        let nextDate = new Date();
        nextDate.setMinutes(nextDate.getMinutes() + interval); // this will be the first reminder time
        console.log(nextDate);

        // make a new Habit with the info and add it to allTasks in correct position
        // allTasks is sorted by reminder time. need to compare times and insert
        // needed the first if statement in case allTasks is empty otherwise the comparison
        //     won't work and the task won't get added

        let task = new Habit(name, nextDate, true, interval, false, 0);
        if (!allTasks.length)
        {
            allTasks[0] = task;
        }
        else
        {
            let inserted = false;
            for (let i = 0; i < allTasks.length; i++)
            {
                if (allTasks[i].time > task.time || !allTasks[i].active)
                {
                    allTasks.splice(i, 0, task);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) { allTasks.push(task); }
        }
    }

    // return home now
    window.open("index.html", "_self");
}