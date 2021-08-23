
var socket = io(window.window.location.origin, { autoconnect: false, transports: ["websocket", "polling"] });
socket.on('userConfirmed', (data) => {
    creteTicket(data.paragraph, data.id)
    localStorage.setItem(data.id, data.paragraph)

})

socket.on("connect_error", (err) => {
    if (err.message === "invalid password") {
        // console.error(err);
    }
});

socket.on("updateStatus", (data) => {
    updateStatus(data.printer, data.file, data.precentage, data.timeLeft)
})

function connect(password) {
    console.log("inside connect");
    socket.auth = { password };
    socket.connect();
}

function creteTicket(paragraph, id) {
    let container = document.querySelector(".container");
    let ticket = document.createElement('div');
    container.appendChild(ticket);
    let paragraphE = document.createElement('div');
    paragraphE.innerText = paragraph;
    paragraphE.setAttribute("class", "paragraph");
    ticket.appendChild(paragraphE);
    let buttons = document.createElement('div');
    buttons.setAttribute("class", buttons);
    let button1 = document.createElement('button');
    button1.setAttribute("id", id);
    button1.innerHTML = 'Accept';
    button1.addEventListener('click', () => { accept(id) });
    let button2 = document.createElement('button');
    button2.setAttribute("id", id);
    button2.innerHTML = 'reject';
    button2.addEventListener('click', () => { reject(id) });
    ticket.appendChild(buttons);
    buttons.appendChild(button1);
    buttons.appendChild(button2);
}

function reject(id) {
    fetch("/admin", {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id
        })

    }
    )
    localStorage.removeItem(id);
}
function accept(id) {
    fetch('/adminconfirm', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            id: id,
        })
    })
    localStorage.removeItem(id);
}

window.onload = function () {
    for (var i = 0; i < localStorage.length; i++) {
        creteTicket(localStorage.getItem(localStorage.key(i)), localStorage.key(i))
    }
}
function updateStatus(printer, file, precentage, timeLeft) {
    let bigDiv = document.querySelector(`.${printer}`);
    bigDiv.querySelector(".file").innerText = `File : ${file}`
    bigDiv.querySelector(".precentage").innerText = `precentage : ${precentage}`
    bigDiv.querySelector(".timeLeft").innerText = `timeLeft : ${timeLeft}`
}



function job(element) {
    fetch("/job", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            printer: element.getAttribute("printer"),
            command: element.innerText
        })

    })
}