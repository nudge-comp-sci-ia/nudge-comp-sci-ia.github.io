class Task
{
    constructor(name, time, active)
    {
        // constructor for base class Task.
        // assigns initial values to private variables name, time, and active
        // these aren't truly private variables, as they are not yet supported in javascript
        // I'm just using underscores to denote that they shouldn't be used outside the class

        this._name = name;
        this._time = time;
        this._active = active;
    }


    /*--- getters and setters ---*/

    get name()
    {
        return this._name;
    }

    set name(name)
    {
        this._name = name;
    }

    get time()
    {
        return this._time;
    }

    set time(time)
    {
        this._time = time;
    }

    get active()
    {
        return this._active;
    }

    set active(active)
    {
        this._active = active;
    }


    /*--- information export ---*/
    // needed these because methods aren't supported by JSON.stringify().
    // needed to export info to an array, and subsequently make a new class based off that array
    // this function is never used, as it is overriden by OneTask.exportInfo() and Habit.exportInfo()

    exportInfo()
    {
        let time = [this._time.getFullYear(), this._time.getMonth(), this._time.getDate(), this._time.getHours(), this._time.getMinutes()];
        let info = [this._name, time, this._active];
        return info;
    }
}


class OneTask extends Task
{
    constructor(name, time, active, completed)
    {
        // constructor for subclass OneTask
        // calls the superclass constructor to set name, time, and active variables
        // defines an additional completed variable

        super(name, time, active);
        this._completed = completed;
    }


    /*--- getters and setters ---*/

    get completed()
    {
        return this._completed;
    }

    set completed(completed)
    {
        this._completed = completed;
    }


    /*--- information export ---*/
    // overrides Task.exportInfo() with added detail of this._completed
    // needed to convert the date into an array to avoid information loss

    exportInfo()
    {
        let time = [this._time.getFullYear(), this._time.getMonth(), this._time.getDate(), this._time.getHours(), this._time.getMinutes()];
        let info = [this._name, time, this._active, this._completed];
        return info;
    }
}


class Habit extends Task
{
    constructor(name, time, active, interval, fulfilled, strikes)
    {
        // constructor for subclass Habit
        // calls the superclass constructor to set name, time, and active variables
        // additionally asks for the interval in which the habit is to be completed, fulfilled status, and number of current strikes

        super(name, time, active);
        this._interval = interval;
        this._fulfilled = fulfilled;
        this._strikes = strikes;
    }


    /*--- getters and setters ---*/

    get interval()
    {
        return this._interval;
    }

    set interval(interval)
    {
        this._interval = interval;
    }

    get fulfilled()
    {
        return this._fulfilled;
    }

    set fulfilled(fulfilled)
    {
        this._fulfilled = fulfilled;
    }

    get strikes()
    {
        return this._strikes;
    }

    set strikes(strikes)
    {
        this._strikes = strikes;
    }


    /*--- information export ---*/
    // overrides Task.exportInfo(), with added details of this._interval, this._fulfilled, and this._strikes
    // need to convert the date to an array

    exportInfo()
    {
        let time = [this._time.getFullYear(), this._time.getMonth(), this._time.getDate(), this._time.getHours(), this._time.getMinutes()];
        let info = [this._name, time, this._active, this._interval, this._fulfilled, this._strikes];
        return info;
    }
}


// retrieve all task info from previous sessions
// if no info is found, set it as a new empty array
// from the array, convert all the info into objects
// this will convert allTasks from a 2-dimensional array into an array of objects

let allTasks = localStorage.getItem("_allTasks");
if (!allTasks) { allTasks = []; }
else { allTasks = JSON.parse(atob(allTasks)); } // convert from stringified to array

for (let i = 0; i < allTasks.length; i++)
{
    let info = allTasks[i] // unpack an array

    if (info.length === 4)
    {
        // was a OneTask. replace in the array with a OneTask of same info
        
        allTasks[i] = new OneTask(info[0], info[1], info[2], info[3]);
    }

    else if (info.length === 6)
    {
        // was a Habit. replace in the array with a Habit of same info

        allTasks[i] = new Habit(info[0], info[1], info[2], info[3], info[4], info[5]);
    }

    // convert the time array into a Date object
    allTasks[i].time = new Date(allTasks[i].time[0], allTasks[i].time[1], allTasks[i].time[2], allTasks[i].time[3], allTasks[i].time[4], 0, 0);
}


// need to back up all the info on all the tasks back into localStorage so it persists for next visit
// take any objects in allTasks, convert to arrays, convert the array allTasks, and save to localStorage
// using OneTask.exportInfo() and Habit.exportInfo() to quickly convert to arrays
// this will turn allTasks from an array of objects into a 2-dimensional array
// effectively the opposite of the previous code block
// allTasks [i][1] represents the time for any given i. this needs to be effectively unpacked into another array

window.onunload = function()
{
    for (let i = 0; i < allTasks.length; i++)
    {
        allTasks[i] = allTasks[i].exportInfo();
    }

    // now that it's a 2 dimensional array, stringify and convert, upload to localStorage

    allTasks = btoa(JSON.stringify(allTasks));
    localStorage.setItem("_allTasks", allTasks);
}


// set up a timer that checks if a notification needs to be given
// checks every 15 seconds, which is good enough
// searches through allTasks to see if any task times have been passed,
//     then gives a notification and either postpones the task, fulfills it, or deactivates it
// using window.setInterval() to repeatedly check for deadlines, then defining checkNotifications()

window.setInterval(checkNotifications, 15000);

function checkNotifications()
{
    let currentTime = new Date();

    for (let i = 0; i < allTasks.length; i++)
    {
        // remember that allTasks is sorted by time, with inactive tasks at the end
        if (currentTime < allTasks[i].time || !allTasks[i].active) { break; } // we've passed all the tasks that may need to be notified

        // if we're still here, a notification needs to be given

        notify("Hey! How about you finish your task \"" + allTasks[i].name + "\" right now?");
        let response = prompt("This is a reminder for your task \"" + allTasks[i].name + ".\" Have you done it? (yes/no)" + 
                                "\n If you want, you can have another 15 minutes by typing 'defer'");

        currentTime = new Date();

        if (response.toLowerCase().startsWith('y'))
        {
            // responded yes. either set OneTask.completed or Habit.fulfilled to true
            // need to make the necessary changes to ensure that we aren't bothered with the same notification again
            if (!allTasks[i].interval)
            {
                // is a OneTask
                allTasks[i].completed = true;
                allTasks[i].active = false;
            }
            else
            {
                // is a Habit
                allTasks[i].fulfilled = true;
                allTasks[i].strikes = 0; // to reset the neglection counter
                allTasks[i].time = new Date(currentTime.getTime() + allTasks[i].interval * 60000);
            }
        }

        else if (response.toLowerCase().startsWith('n'))
        {
            // responded no. either set OneTask.completed or Habit.fulfilled to false
            // necessary changes so that we aren't bothered by the same notification again
            if (!allTasks[i].interval)
            {
                // is a OneTask
                allTasks[i].completed = false;
                allTasks[i].active = false;
            }
            else
            {
                // is a Habit
                allTasks[i].fulfilled = false;
                allTasks[i].strikes++;
                if (allTasks[i].strikes >= 3)
                {
                    // has neglected the task. kill the flowerbed.
                    allTasks[i].active = false;
                }
                else
                {
                    // set the next time to current time plus the interval
                    allTasks[i].time = new Date(currentTime.getTime() + allTasks[i].interval * 60000);
                }
            }
        }

        else
        {
            // assume it was a defer. don't change the completion values or anything, just push the next
            //     notification time to 15 minutes in the future

            allTasks[i].time = new Date(currentTime.getTime() + 15 * 60000);
            alert("Okay, 15 more minutes. Do it soon!");
        }

        // if allTasks[i].active changed to false, we should move it to the end of allTasks so that we don't need to worry about it anymore

        if (!allTasks[i].active)
        {
            allTasks = allTasks.concat(allTasks.splice(i, 1));
        }
    }

    // changes may have been made to the state of the tasks, so we need to flush the garden images now
    try
    {
        flushGarden();
    }
    catch (ReferenceError)
    {
        // this means that we're not on the home page. carry on. no need to change anything.
    }
}


// function to give a browser notification for times such as the user being on a different tab

function notify(msg)
{
    // check whether notification permissions have already been granted
    if (Notification.permission === "granted")
    {
        // create notification
        let notification = new Notification(msg);
    }
  
    // need to ask for permission
    else if (Notification.permission !== "denied")
    {
        Notification.requestPermission().then(function (permission)
        {
            // If the user accepts, let's create a notification
            if (permission === "granted")
            {
                let notification = new Notification(msg);
            }
        });
    }
}


// separated function to handle image choice that can be used on all pages

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
