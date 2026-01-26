const date = new Date();

const examTime = [
    {
        start: new Date("2026-03-04T12:00:00"),
        end: new Date("2026-03-04T14:20:00")
    },
    {
        start: new Date("2026-04-15T12:00:00"),
        end: new Date("2026-04-15T14:20:00")
    },
    {
        start: new Date("2026-05-08T09:00:00"),
        end: new Date("2026-05-08T17:00:00")
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
    topnav.innerHTML = `<span class="logo"> <img src="/SP26/img/logo.png" style="vertical-align: middle; height: 25px; width: 25px" alt="logo"></span> &nbsp; PILOT Learning for <i>Differential Equations</i> &nbsp; &nbsp; Exam Mode`;
};