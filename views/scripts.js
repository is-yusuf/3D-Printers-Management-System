let outputDiv = document.createElement('dates');
let h3;
window.rejectbtn = document.getElementById('reject')
window.acceptbtn = document.getElementById('accept')
document.getElementById('accept').addEventListener(('click'), () => {
    confirm(acceptbtn.getAttribute('start'), acceptbtn.getAttribute('end'))
})
document.getElementById('reject').addEventListener(('click'), () => {
    reject(acceptbtn.getAttribute('start'), acceptbtn.getAttribute('end'))
})
let calID;


/**
 * Gets the values from input fields and displays the printer image
 */
function DisplayResults() {
    let material = document.getElementById('material').value
    let size = document.getElementById('size').value
    let prec = document.querySelector("#prec").value
    let printer = choosePrinter(material, size, prec);
    let output = document.getElementById('printer');
    let image = document.getElementById('printerimg');
    let div_image = document.querySelector(".printer-result");
    div_image.hidden = false;
    output.innerHTML = printer.text;
    image.src = printer.src;
    image.style.display = "block"
    document.querySelector('.describtion').hidden = false

    calID = printer.calID;
    enableInputs()

}
function enableInputs() {
    document.querySelector('#textInput').disabled = false
    document.querySelector('#duration').disabled = false
    document.querySelector('#date').disabled = false
    document.querySelector('#ASAP').disabled = false

}

/**
 * decided which printer to use according to parameters provided
 * @param {String} material material used 
 * @param {String} size size of print (less4,4to9,more9) 
 * @param {String} prec preciseness vs speed (1 to 3) 
 * @returns {Printer{src:"src of image", Link:"link to insturctions" ,text:"text shown" }
 */
function choosePrinter(material, size, prec) {

    let balin = { src: "./assets/imgs/balin.jpg", Link: "dwalin.make-it.cc", text: "miniv2", calID: "c_3jgvbprejl4t77q38a2k3obs0c@group.calendar.google.com" }
    let dwalin = { src: "./assets/imgs/miniv2.jpg", Link: "dwalin.make-it.cc", text: "miniv2", calID: "c_ed1lt228ffjpd5sdgc0uamprg4@group.calendar.google.com" }
    let thorin = { src: "./assets/imgs/prusa.jpg", Link: "dwalin.make-it.cc", text: "prusa", calID: "c_sjipjk55n0kjfkdl3kl3i0bqoo@group.calendar.google.com" }
    let fili = { src: "./assets/imgs/taz4.jpg", Link: "dwalin.make-it.cc", text: "taz4", calID: "c_nldd7mhr8ip3kb9apg7aerb634@group.calendar.google.com" }
    let kili = { src: "./assets/imgs/taz6.jpg", Link: "dwalin.make-it.cc", text: "taz6", calID: "c_gu67pim474cml15g40j0r8ni9k@group.calendar.google.com" }

    if (size == "more9") {
        if (prec == 1) {
            return fili;
        }
        return kili;
    }
    else if (size == "less4") {
        return balin;
    }
    else if (size == "4to9") {
        if (prec < 3) {
            return thorin
        }
        return fili;
    }
}

/**
 * Checks with the calendar to see the next available slot and display it to the user
 */
function ASAP() {
    if (calID == undefined) {
        window.alert("Please fill the first part of the form to select a printer")
        return
    }
    let date = document.getElementById('date').value
    let duration = document.getElementById('duration').value
    let reqbody = { date: date, duration: duration, calID };
    fetch("/asap", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqbody)
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
    document.getElementById('offer').appendChild(h3);
    // document.getElementById('offer').insertBefore(h3, document.getElementById('accept'))
    document.getElementById('details').style.display = 'block';
    document.getElementById('name').disabled = false
    document.getElementById('email').disabled = false
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
            if (start.getHours() >= 20) {
                window.alert("the date you entered has no more available slots")
            }
            reject(start, end)
        }
    })
}
function checkRequiredFields() {
    return (Array.from(document.querySelectorAll('input[required]')).reduce((acc, el) => acc && !!el.value, true) && validateEmail(document.querySelector("#email").value));
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}

/**
 * 
 * @param {date} startdate the start of the date you want to schedule 
 * @param {date} enddate the end of the date you want to schedule
 */
function confirm(startdate, enddate) {
    if (!checkRequiredFields()) {
        window.alert("Please fill all the required fields")
        return;
    }
    let files = document.querySelector("#GCode");
    sendFile(files.files[0])
    // schedule(startdate,enddate);
}
/**
 * Schedules an event between start and end dates
 * @param {String or Date} startdate 
 * @param {String or Date} enddate 
 */
function schedule(startdate, enddate) {
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

function sendFile(file) {
    const formData = new FormData();
    formData.append('file', file, "1.gcode");
    let username = document.querySelector("#email").value.slice(0, document.querySelector("#email").value.indexOf("@")).toLowerCase();
    let date = new Date(acceptbtn.getAttribute('start')).getTime()
    formData.append('filename', username + "_" + date + "_" + document.querySelector("#material").value + "_" + document.querySelector("#printer").innerHTML + "_" + document.querySelector("#duration").value)
    formData.append('milliseconds', date - ((new Date()).getTime()) - 30000 * 60)
    formData.append('email', document.querySelector("#email").value)
    formData.append('name', document.querySelector("#name").value)
    let confirmation_link = `${window.window.location.href}userConfirm?id=${username + "_" + date + "_" + document.querySelector("#material").value + "_" + document.querySelector("#printer").innerHTML + "_" + document.querySelector("#duration").value}`;
    formData.append('content', `Hello ${document.querySelector("#name").value},
Our system shows that there is a 3D-print held in queue under your name starting in 30 Minutes.
To confirm, please click the following link. ${confirmation_link}`)
    fetch("/upload", {
        method: 'POST',
        headers: {
        },
        body: formData
    }).then(res => {
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
