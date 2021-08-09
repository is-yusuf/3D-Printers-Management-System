var outputDiv = document.createElement('dates');
document.getElementById('accept').style.display = "none";
document.getElementById('reject').style.display = "none";
let h3;
let rejectbtn = document.getElementById('reject')
let acceptbtn = document.getElementById('accept')
document.getElementById('accept').addEventListener(('click'), () => {
    confirm(acceptbtn.getAttribute('start'), acceptbtn.getAttribute('end'))
})
document.getElementById('reject').addEventListener(('click'), () => {
    reject(acceptbtn.getAttribute('start'), acceptbtn.getAttribute('end'))
})
function DisplayResults() {
    let material = document.getElementById('material').value
    let size = document.getElementById('size').value
    let prec = document.querySelector("#prec").value
    console.log({ material, size, prec });
    // do the calculation using data collected
    let output = document.getElementById('printer');
    let image = document.getElementById('printerimg');
    output.innerHTML = "this is a placeholder for the printer";
    image.src = "./assets/oofa.png";
    image.style.display = "block"
}

function choosePrinter(material, size, prec) {
    let printers = {
        miniv2: { src: "./assets/imgs/miniv2", Link: "dwalin.make-it.cc" },
        prusa: { src: "./assets/imgs/prusa", Link: "dwalin.make-it.cc" },
        taz4: { src: "./assets/imgs/taz4", Link: "dwalin.make-it.cc" },
        taz6: { src: "./assets/imgs/taz6", Link: "dwalin.make-it.cc" },
    }
    if (size == "more9") {
        delete printers.miniv2;
        delete printers.prusa;
    }
}


/**
 * Checks with the calendar to see the next available slot and display it to the user
 */
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

        if (!data) {
            window.alert("the date you entered has no available slots")
            return;
        }
        else {
            updateBtnValues(data.start, data.end)
            displaydate(new Date(data.start), new Date(data.end))
        }
    })

}
function updateBtnValues(startdate, enddate) {
    acceptbtn.setAttribute("start", startdate)
    acceptbtn.setAttribute("end", enddate)
    rejectbtn.setAttribute("start", startdate)
    rejectbtn.setAttribute("end", enddate)
}
/**
 * Displays the current date for the user to accept or reject
 * @param {date || String} start the start date to display
 * @param {date || String} end the end date you want to display
 */
function displaydate(start, end) {
    if (h3 == undefined) {
        h3 = document.createElement('h3');
    }
    updateBtnValues(start, end)
    h3.innerHTML = `${start} <br>  ${end}`;
    document.getElementById('offer').insertBefore(h3, document.getElementById('accept'))
    document.getElementById('accept').style.display = "inline";
    document.getElementById('reject').style.display = "inline";



}

function showEventDate(start, end) {

}

/**
 * rejects a date, adds 30 minutes to the events and checks with the user again
 * @param {date} start the start date you want to reject  
 * @param {date} end the end date you want to reject
 */
function reject(start, end) {
    start = new Date(start)
    end = new Date(end)
    if (start.getHours() >= 20) {
        window.alert("the date you entered has no more available slots")

    }
    start.setMinutes(start.getMinutes() + 30)
    end.setMinutes(end.getMinutes() + 30)
    fetch("/checkexactdate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ start, end })
    }).then(res => {
        return res.json();

    }).then((data) => {
        if (data) {
            displaydate(start, end)
        }
        else {
            console.log('needs to be implemented')
        }
    })
}

/**
 * 
 * @param {date} startdate the start of the date you want to schedule 
 * @param {date} enddate the end of the date you want to schedule
 */
function confirm(startdate, enddate) {
    let reqbody = { start: new Date(startdate), end: new Date(enddate) }
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

function updateTextInput(val) {
    document.getElementById('textInput').value = val;
}
/**
 * Updates the value in the slider.
 * @param {number} val the value in the slider. 
 */
function updateRange(val) {
    document.getElementById("duration").value = val;
}
window.onload = function () {
    updateTextInput(document.getElementById('duration').value)
    document.getElementById('date').value = formatDate(new Date());
}
/**
 * Formats a date object to yyyy-mm-dd 
 * @param {date} date date object you want to format 
 * @returns {String} String in the form of yyyy-mm-dd
 */
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
