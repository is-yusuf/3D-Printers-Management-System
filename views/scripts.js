var outputDiv = document.createElement('dates');

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

    // console.log(div)

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

function schedule(btn) {
    let btnobject = { start: btn.getAttribute('start'), end: btn.getAttribute('start') }
    console.log(btnobject);

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