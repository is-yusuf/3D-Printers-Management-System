var outputDiv = document.createElement('dates');
document.getElementById('accept').style.display = "none";
document.getElementById('reject').style.display = "none";

document.getElementById("submit").addEventListener(("click"), () => {
    DisplayResults();
})

document.getElementById("check").addEventListener(('click'), () => {
    checkSchedule();
})


function DisplayResults() {
    let material = document.getElementById('material').value
    let size = document.getElementById('size').value
    // do the calculation using data collected
    let output = document.getElementById('printer');
    let image = document.getElementById('printerimg');
    output.innerHTML = "this is a placeholder for the printer";
    image.src = "./assets/oofa.png";
}
function ASAP() {
    let date = document.getElementById('date').value
    let duration = document.getElementById('duration').value
    let dateAndDuration = { date: date, duration: duration };
    fetch("/asap", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateAndDuration)
    }).then(res => {
        return res.json();

    }).then((data) => {

        let start = new Date(data.start)

        let end = new Date(data.end)

        if (!data) {
            window.alert("the date you entered has no available slots")
            return;
        }
        else {
            h3 = document.createElement('h3');
            h3.innerHTML = `${start} <br>  ${end}`;
            document.getElementById('offer').insertBefore(h3, document.getElementById('accept'))
            document.getElementById('accept').style.display = "inline";
            document.getElementById('reject').style.display = "inline";
            document.getElementById('accept').addEventListener(('click'), () => {
                confirm(start, end)
            })

            document.getElementById('reject').addEventListener(('click'), () => {
                window.alert("please select another date")
            })


        }

    })

}
function accept() {
    confirm(start, end)
}
function reject() {
    window.alert("Choose another day please")
}

function checkSchedule() {
    let date = document.getElementById('date').value
    let duration = document.getElementById('duration').value
    let dateAndDuration = { date: date, duration: duration };
    fetch("/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateAndDuration)
    }).then(res => {
        return res.json();

    }).then((data) => {
        printAvailableSlots(data.availableslots);
    })

}

function printAvailableSlots(slotsArr) {
    displayDateHeader(slotsArr);
    displayDateButtons(slotsArr)
    document.body.appendChild(outputDiv);

}

function displayDateHeader(slotsArr) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    var title = document.createElement(`h2`);

    dateItem = slotsArr[0];
    dateItem.start = new Date(dateItem.start)
    const month = monthNames[dateItem.start.getMonth()];
    const day = String(dateItem.start.getDate()).padStart(2, '0');
    const year = dateItem.start.getFullYear();
    const output = month + '\n' + day + ',' + year;
    title.innerHTML = `${output}`;
    outputDiv.appendChild(title);
    outputDiv.appendChild(document.createElement(`br`));
}
function displayDateButtons(slotsArr) {
    let i = 1;
    slotsArr.forEach((dateItem, index) => {
        let btn = document.createElement('button');
        btn.setAttribute("id", index)
        btn.setAttribute("start", new Date(dateItem.start))
        btn.setAttribute("end", new Date(dateItem.end))
        btn.addEventListener("click", () => {
            schedule(btn);
        })
        dateItem.start = new Date(dateItem.start)
        dateItem.end = new Date(dateItem.end)

        let start = dateItem.start.getHours() + ":" + dateItem.start.getMinutes() + "__" + dateItem.end.getHours() + ":" + dateItem.end.getMinutes();
        btn.innerHTML = start
        outputDiv.appendChild(btn);
        if (i % 2 == 0) {
            outputDiv.appendChild(document.createElement(`br`));
        }
        i++

    })
}


function confirm(startdate, enddate) {
    let reqbody = { start: startdate, end: enddate }
    fetch("/schedule", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqbody)
    }).then(res => {
        return res.json();
    }).then((data) => {
        printAvailableSlots(data.availableslots);
    })
}






function schedule(btn) {
    let btnobject = { start: btn.getAttribute('start'), end: btn.getAttribute('end') }


    fetch("/schedule", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(btnobject)
    }).then(res => {
        return res.json();
    }).then((data) => {
        printAvailableSlots(data.availableslots);
    })
}
function updateTextInput(val) {
    document.getElementById('textInput').value = val;
}
function updateRange(val) {
    document.getElementById("duration").value = val;
}
window.onload = function () {
    updateTextInput(document.getElementById('duration').value)
    document.getElementById('date').value = formatDate(new Date());
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}