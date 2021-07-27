import { cal } from "./Calender.js";

const calender = new cal();
oAuth2Client.setCredentials({
    refresh_token: '1//04YA_tHCNgrwfCgYIARAAGAQSNwF-L9IrWYRtinxD0fWUEYIcsq1zdX9VoYXk3fOcqBsMlPAqxpxfDEsBj3kpjN7GYd6M93yApRU',
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
    console.log(date);
}