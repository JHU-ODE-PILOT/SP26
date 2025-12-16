const date = new Date();

const examTime = [
    {
        start: new Date("2025-09-16T08:00:00"),
        end: new Date("2025-09-16T09:00:00")
    },
    {
        start: new Date("2025-10-07T08:00:00"),
        end: new Date("2025-10-07T09:00:00")
    },
    {
        start: new Date("2025-10-28T08:00:00"),
        end: new Date("2025-10-28T09:00:00")
    },
    {
        start: new Date("2025-11-18T08:00:00"),
        end: new Date("2025-11-18T09:00:00")
    },
    {
        start: new Date("2025-12-15T09:00:00"),
        end: new Date("2025-12-15T12:00:00")
    },
]

examTime.forEach((block) => {
    if (date.getTime() >= block.start.getTime() && date.getTime() <= block.end.getTime()) {
        disablePage();
    } 
})

function disablePage() {
    const contents = document.getElementById("contents");
    contents.innerHTML = `<div style="text-align: center"><h1>Assessment in progress.</h1><br><h2>The page will be enabled once the assessment is over.</h2><br><button onclick="location.reload();">Refresh</button></div>`
    const botnav = document.getElementById("btm");
    botnav.innerHTML = `Good luck on your exam`;
    const topnav = document.getElementById("top");
    topnav.innerHTML = `<span class="logo"> <img src="/FA25/img/logo.png" style="vertical-align: middle; height: 25px; width: 25px" alt="logo"></span> &nbsp; PILOT Learning for <i>Differential Equations</i> &nbsp; &nbsp; Exam Mode`;
};