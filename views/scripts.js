
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
    let btngan = { date: date, duration: duration };
    let dataToSend = JSON.stringify(btngan);
    console.log(dataToSend);
    fetch("/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: dataToSend
    }).then(res => {
        return res.json()
    }).then((data) => {
        console.log(data)
    })
}