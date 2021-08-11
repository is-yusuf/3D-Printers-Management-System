let outputDiv = document.createElement('dates');
document.getElementById('accept').style.display = "none";
document.getElementById('reject').style.display = "none";
let h3;
window.rejectbtn = document.getElementById('reject')
window.acceptbtn = document.getElementById('accept')
document.getElementById('accept').addEventListener(('click'), () => {
    confirm(acceptbtn.getAttribute('start'), acceptbtn.getAttribute('end'))
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
    output.innerHTML = printer.text;
    image.src = printer.src;
    image.style.display = "block"
    image.style.width = "100px";
    calID = printer.calID;
}

/**
 * decided which printer to use according to parameters provided
 * @param {String} material material used 
 * @param {String} size size of print (less4,4to9,more9) 
 * @param {String} prec preciseness vs speed (1 to 3) 
 * @returns {Printer{src:"src of image", Link:"link to insturctions" ,text:"text shown" }
 */
function choosePrinter(material, size, prec) {

    function checkSchedule() {
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
            body: dataToSend
        }).then(res => {
            return res.json()
        }).then((data) => {
            console.log(data)
        })
    }
