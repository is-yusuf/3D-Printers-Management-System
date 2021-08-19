var socket = io.connect('http://localhost:5500/');
socket.on('userConfirmed', (data) => {
    creteTicket(data.paragraph, data.id)
})


function creteTicket(paragraph, id) {
    let container = document.querySelector(".container");

    let ticket = document.createElement('div');
    container.appendChild(ticket);
    let paragraphE = document.createElement('div');
    paragraphE.innerHTML = paragraph;
    paragraphE.setAttribute("class", paragraph);

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
    console.log(`going to reject this ${id}`);
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
}
